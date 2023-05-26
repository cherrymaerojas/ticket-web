import { Module } from '@nestjs/common'
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

@Module({
    imports: [
        NestConfigModule.forRoot({
            validationSchema: Joi.object({
                DATABASE_TYPE: Joi.string().required(),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().required(),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().allow(''),
                DATABASE_NAME: Joi.string().required(),
                DATABASE_SYNCHRONIZE: Joi.bool().required(),
                DATABASE_AUTO_LOAD_ENTITIES: Joi.bool().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
                JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
            })
        })
    ],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigModule { }
