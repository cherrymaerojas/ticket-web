import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum'
import { UsersService } from './users.service'

@Auth(AuthType.None)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getUser() { return 'test' }

    @Get(':id/:donuts')
    test(@Param() param) {
        console.log(param)
    }
}
