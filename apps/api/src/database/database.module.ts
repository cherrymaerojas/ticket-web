import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from 'src/config/config.module'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<any>('DATABASE_TYPE'),
                host: configService.get<string>('DATABASE_HOST'),
                port: +configService.get<number>('DATABASE_PORT'),
                database: configService.get<string>('DATABASE_NAME'),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                autoLoadEntities: configService.get<boolean>('DATABASE_AUTO_LOAD_ENTITIES'),
                synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
            }),
            inject: [ConfigService]
        }),
    ]
})
export class DatabaseModule { }
