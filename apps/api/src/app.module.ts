import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { DatabaseModule } from './database/database.module'
import { IamModule } from './iam/iam.module'
import { TicketsModule } from './tickets/tickets.module'
import { UsersModule } from './users/users.module'
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'client', 'dist'),
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        UsersModule,
        IamModule,
        TicketsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
