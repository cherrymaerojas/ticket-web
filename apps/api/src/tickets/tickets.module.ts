import { Module } from '@nestjs/common';
import { CrawlersModule } from 'src/crawlers/crawlers.module';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [CrawlersModule],
  controllers: [TicketsController],
})
export class TicketsModule {}
