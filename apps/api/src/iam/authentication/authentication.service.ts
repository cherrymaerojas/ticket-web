import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'
import jwtConfig from '../config/jwt.config'
import { HashingService } from '../hashing/hashing.service'
import { ActiveUserData } from '../interfaces/active-user-data.interface'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage'

@Injectable()
export class AuthenticationService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage
    ) { }

    async signup(signupDto: SignUpDto) {
        try {
            const user = new User()

            user.username = signupDto.username
            user.password = await this.hashingService.hash(signupDto.password)

            await this.userRepo.save(user)
        } catch (error) {
            const pgUniqueViolationErrorCode = '23505'
            if (error.code === pgUniqueViolationErrorCode) {
                throw new ConflictException()
            }
            throw error
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepo.findOneBy({ username: signInDto.username })
        if (!user) {
            throw new UnauthorizedException('User does not exists')
        }
        const isEqual = await this.hashingService.compare(signInDto.password, user.password)
        if (!isEqual) {
            throw new UnauthorizedException('Password does not match')
        }
        return await this.generateTokens(user)
    }

    async generateTokens(user: User) {
        const refreshTokenId = randomUUID()
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTll, { username: user.username }),
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTll, {
                refreshTokenId,
            })
        ])
        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
        return { accessToken, refreshToken }
    }

    async generateRefreshToken(user: User) {
        const refreshTokenId = randomUUID()
        const refreshToken = await this.signToken(user.id, this.jwtConfiguration.refreshTokenTll, {
            refreshTokenId,
        })
        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
        return { refreshToken }
    }

    async generateAccessToken(user: User) {
        const accessToken = await this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTll, { username: user.username })
        return { accessToken }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }>(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret
            })

            const user = await this.userRepo.findOneByOrFail({ id: sub })
            const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId)

            if (isValid) {
                await this.refreshTokenIdsStorage.invalidate(user.id)
            } else {
                throw new Error('Invalid token')
            }
            return this.generateTokens(user)
        } catch (err) {
            if (err instanceof InvalidatedRefreshTokenError) {
                throw new UnauthorizedException('Access Denied')
            }
            throw new UnauthorizedException()
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn
            }
        )
    }
}
