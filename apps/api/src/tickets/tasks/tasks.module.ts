import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PuppeteerModule } from 'nest-puppeteer'
import { Event } from '../entities/event.entity'
import { Performance } from '../entities/performance.entity'
import { Performer } from '../entities/performer.entity'
import { Provider } from '../entities/provider.entity'
import { SeatMap } from '../entities/seatmap.entity'
import { Venue } from '../entities/venue.entity'
import { TasksService } from './tasks.service'


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
        PuppeteerModule.forRoot(),
    ],
    providers: [
        TasksService
    ],
})
export class TasksModule { }
