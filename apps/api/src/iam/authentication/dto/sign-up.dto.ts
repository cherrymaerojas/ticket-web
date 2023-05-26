import { IsString, IsStrongPassword } from 'class-validator'

export class SignUpDto {
    @IsString()
    username: string

    @IsStrongPassword()
    password: string
}
