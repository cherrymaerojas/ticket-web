import { PassportSerializer } from "@nestjs/passport"
import { ActiveUserData } from "src/iam/interfaces/active-user-data.interface"
import { User } from "src/users/entities/user.entity"

export class UserSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error, user: ActiveUserData) => void) {
        done(null, {
            sub: user.id,
            username: user.username
        })
    }
    deserializeUser(payload: ActiveUserData, done: (err: Error, user: ActiveUserData) => void) {
        done(null, payload)
    }
}
