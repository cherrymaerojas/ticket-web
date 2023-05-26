import { IsString } from "class-validator"

export class SignInDto {
    @IsString()
    username: string

    password: string
}
