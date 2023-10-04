import { Controller, Get } from '@nestjs/common';
import { DenverCenterService } from 'src/crawlers/denverCenter.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly denver: DenverCenterService) {}

  @Get()
  async test() {
    await this.denver.getSeats();
  }
}
