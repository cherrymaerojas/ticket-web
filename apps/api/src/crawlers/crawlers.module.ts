import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaywrightModule } from 'nestjs-playwright';
import { Event } from './entities/event.entity';
import { Performance } from './entities/performance.entity';
import { Performer } from './entities/performer.entity';
import { Provider } from './entities/provider.entity';
import { SeatMap } from './entities/seatmap.entity';
import { Venue } from './entities/venue.entity';
import { MirvishService } from './mirvish.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DenverCenterService } from './denverCenter.service';
import { FiftAvenueService } from './fifthAvenue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      SeatMap,
      Performance,
      Performer,
      Provider,
      Venue,
    ]),
    PlaywrightModule.forRoot({
      headless: true,
      channel: 'chrome',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [MirvishService, DenverCenterService],
  exports: [MirvishService, DenverCenterService],
})
export class CrawlersModule {}
