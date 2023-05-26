import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY } from '../../decorators/auth.decorator'
import { AuthType } from '../../enums/auth-type.enum'
import { AccessTokenGuard } from '../access-token/access-token.guard'
import { SessionGuard } from '../session/session.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {

    private static readonly defaultAuthType = AuthType.Session
    private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
        [AuthType.Bearer]: this.accessTokenGuard,
        [AuthType.None]: { canActivate: () => true },
        [AuthType.Session]: this.sessionGuard
    }

    constructor(private readonly reflector: Reflector, private readonly accessTokenGuard: AccessTokenGuard, private readonly sessionGuard: SessionGuard) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
            AUTH_TYPE_KEY,
            [context.getHandler(), context.getClass()],
        ) ?? [AuthenticationGuard.defaultAuthType]

        const guards = authTypes.map(type => this.authTypeGuardMap[type]).flat()

        for (const instance of guards) {
            const canActivate = await Promise.resolve(
                instance.canActivate(context)
            )
            if (canActivate) {
                return true
            }
        }
        throw new UnauthorizedException()
    }
}
