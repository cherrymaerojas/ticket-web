import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as createRedisStore from 'connect-redis'
import * as session from 'express-session'
import { Redis } from 'ioredis'
import * as passport from 'passport'
import { User } from 'src/users/entities/user.entity'
import { AuthenticationController } from './authentication/authentication.controller'
import { AuthenticationService } from './authentication/authentication.service'
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard'
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard'
import { SessionGuard } from './authentication/guards/session/session.guard'
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage'
import { UserSerializer } from './authentication/serializers/user-serializer'
import { SessionAuthenticationController } from './authentication/session-authentication.controller'
import { SessionAuthenticationService } from './authentication/session-authentication.service'
import jwtConfig from './config/jwt.config'
import { BycryptService } from './hashing/bycrypt/bycrypt.service'
import { HashingService } from './hashing/hashing.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig)
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BycryptService
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard
        },
        AccessTokenGuard,
        SessionGuard,
        RefreshTokenIdsStorage,
        AuthenticationService,
        SessionAuthenticationService,
        UserSerializer
    ],
    controllers: [AuthenticationController, SessionAuthenticationController]
})
export class IamModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        const RedisStore = createRedisStore(session)
        consumer.apply(session({
            store: new RedisStore({ client: new Redis(6379, 'localhost') }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                sameSite: true,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }
        }),
            passport.initialize(),
            passport.session()
        ).forRoutes("*")
    }
}
