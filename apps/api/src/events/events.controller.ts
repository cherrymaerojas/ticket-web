import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getEvents() {
    return this.eventsService.fetchEvents();
  }

  @Get('venues')
  @HttpCode(HttpStatus.OK)
  getVenues() {
    return this.eventsService.fetchVenues();
  }

  @Get('performance/:id')
  @HttpCode(HttpStatus.OK)
  getEventsPerformance(@Param('id') id: string) {
    return this.eventsService.fetchEventsPerformance(id);
  }

  @Get('performance/:id/inventory')
  @HttpCode(HttpStatus.OK)
  getEventsSeats(@Param('id') id: string) {
    return this.eventsService.fetchEventsSeats(id);
  }

  @Get('venues/inventory/:id')
  @HttpCode(HttpStatus.OK)
  getVenuesEventIdsgetVenue(
    @Param('id') id: string,
    @Query('eventsIds') eventsIds: string,
  ) {
    return this.eventsService.fetchVenuesEventIdsgetVenue(id, eventsIds);
  }

  @Get('venues/:id')
  @HttpCode(HttpStatus.OK)
  getVenue(@Param('id') id: string) {
    return this.eventsService.fetchVenue(id);
  }
}
