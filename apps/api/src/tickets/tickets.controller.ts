import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Auth } from 'src/iam/authentication/decorators/auth.decorator'
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketsService } from './tickets.service'

@Auth(AuthType.None)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto)
    }

    @Get()
    findAll() {
        return this.ticketsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(+id, updateTicketDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(+id)
    }
}
