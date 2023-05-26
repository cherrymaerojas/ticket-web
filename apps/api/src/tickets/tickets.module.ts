import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'

@Module({
    imports: [
        TasksModule,
    ],
    controllers: [TicketsController],
    providers: [TicketsService]
})
export class TicketsModule { }
