import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import jwtConfig from 'src/iam/config/jwt.config'
import { REQUEST_USER_KEY } from 'src/iam/iam.constant'

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            return false
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            )
            request[REQUEST_USER_KEY] = payload
        } catch {
            return false
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [_, token] = request.headers.authorization?.split(' ') ?? []
        return token
    }
}
