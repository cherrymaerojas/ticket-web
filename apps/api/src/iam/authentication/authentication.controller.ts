import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { Auth } from './decorators/auth.decorator'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthType } from './enums/auth-type.enum'

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) { }

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signup(signUpDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto)
    }
}
