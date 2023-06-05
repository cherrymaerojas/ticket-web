import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './entities/event.entity'
import { Performance } from './entities/performance.entity'
import { Performer } from './entities/performer.entity'
import { Provider } from './entities/provider.entity'
import { SeatMap } from './entities/seatmap.entity'
import { Venue } from './entities/venue.entity'
import { TasksModule } from './tasks/tasks.module'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'


@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Event,
                SeatMap,
                Performance,
                Performer,
                Provider,
                Venue
            ]
        ),
        TasksModule,
    ],
    controllers: [TicketsController],
    providers: [TicketsService]
})
export class TicketsModule { }
