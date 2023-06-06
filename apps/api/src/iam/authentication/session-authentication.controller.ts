import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { promisify } from 'util'
import { Auth } from './decorators/auth.decorator'
import { SignInDto } from './dto/sign-in.dto'
import { AuthType } from './enums/auth-type.enum'
import { SessionAuthenticationService } from './session-authentication.service'

@Auth(AuthType.None)
@Controller('session-authentication')
export class SessionAuthenticationController {
    constructor(
        private readonly sessionAuthService: SessionAuthenticationService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Req() request, @Body() signInDto: SignInDto) {
        const user = await this.sessionAuthService.signIn(signInDto)
        await promisify(request.login).call(request, user)
    }

    @HttpCode(HttpStatus.OK)
    @Get('sign-out')
    signOut(@Req() request: Request) {
        request.session.destroy(function (err) { })
    }
}
