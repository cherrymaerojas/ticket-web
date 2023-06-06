import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { SeatMap } from './entities/seatmap.entity'

@Injectable()
export class TicketsService {

    constructor(
        @InjectRepository(SeatMap)
        private readonly seatMapRepo: Repository<SeatMap>
    ) { }

    create(createTicketDto: CreateTicketDto) {
        return 'This action adds a new ticket'
    }

    findAll() {
        return this.seatMapRepo.find(
            {
                relations: {
                    event: {
                        performance: {
                            performer: true,
                            provider: true,
                            venue: true,
                        }
                    }
                }
            }
        )
    }

    findOne(id: number) {
        return `This action returns a #${id} ticket`
    }

    update(id: number, updateTicketDto: UpdateTicketDto) {
        return `This action updates a #${id} ticket`
    }

    remove(id: number) {
        return `This action removes a #${id} ticket`
    }

}
