import { Injectable } from '@nestjs/common'
import { compare, genSalt, hash } from 'bcrypt'
import { HashingService } from '../hashing.service'

@Injectable()
export class BycryptService extends HashingService {
    async hash(data: string | Buffer): Promise<string> {
        const salt = await genSalt()
        return hash(data, salt)
    }
    async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
        return compare(data, encrypted)
    }
}
