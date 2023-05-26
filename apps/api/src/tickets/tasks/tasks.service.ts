import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import * as dayjs from 'dayjs'
import { InjectPage } from 'nest-puppeteer'
import type { Page } from 'puppeteer'
import { Repository } from 'typeorm'
import { Event } from '../entities/event.entity'
import { Performance } from '../entities/performance.entity'
import { Performer } from '../entities/performer.entity'
import { Provider } from '../entities/provider.entity'
import { SeatMap } from '../entities/seatmap.entity'
import { Venue } from '../entities/venue.entity'

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(
        @InjectPage() private readonly page: Page,
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        @InjectRepository(SeatMap) private readonly SeatMapRepo: Repository<SeatMap>,
        @InjectRepository(Performance) private readonly performanceRepo: Repository<Performance>,
        @InjectRepository(Provider) private readonly providerRepo: Repository<Provider>,
        @InjectRepository(Performer) private readonly performerRepo: Repository<Performer>,
        @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    ) { }

    private async getTickets() {
        const url = 'https://www.5thavenue.org/tessapi/tickets/productions'
        const response = await axios.get(url)
        if (response.status !== 200) {
            throw new Error('Bad Response')
        }
        const availableShows = response.data
            .filter(data => 'url' in data)
            .map(filteredData => {
                if ('performances' in filteredData) {
                    const { title, url, performances, startDate, endDate, season, isOnSale } = filteredData
                    return {
                        performer: title,
                        isOnSale,
                        url,
                        performances: performances.map(performance => performance.perfNo),
                        startDate,
                        endDate,
                        season
                    }
                }
            })
        return availableShows
    }

    private async getAvailableTickets() {
        try {
            await this.page.setRequestInterception(true)
            this.page.on('request', request => {
                if (request.interceptResolutionState().action === 'already-handled') return
                const startDate = dayjs().startOf('month').format('YYYY-MM-DD')
                const endDate = dayjs().endOf('month').format('YYYY-MM-DD')
                request.continue({ method: 'POST', postData: JSON.stringify({ keywordIds: '', startDate, endDate }), headers: { ...request.headers(), 'content-type': 'application/json', accept: 'application/json' } })
            })
            const response = await this.page.goto('https://my.5thavenue.org/api/products/productionseasons')
            if (!response.ok()) {
                throw new Error('Bad Response')
            }
            const cookies = await this.page.cookies()
            const [visid, incap] = cookies.filter((cookie) => cookie.name.includes('visid_incap') || cookie.name.includes('incap_ses'))
            let productionSeasons = await response.json()
            productionSeasons = productionSeasons.filter(show => show.performances[0].productTypeId === 1)
            return {
                productionSeasons,
                cookie: `${visid.name}=${visid.value}; ${incap.name}=${incap.value};`
            }
        } catch (err) {
            throw err
        }
    }

    private async fetch(url) {
        try {
            await this.page.setRequestInterception(true)
            this.page.on('request', request => {
                if (request.interceptResolutionState().action === 'already-handled') return
                request.continue({ method: 'GET', headers: { ...request.headers(), accept: 'application/json' } })
            })
            const response = await this.page.goto(url)
            if (!response.ok()) {
                throw new Error('Bad Response')
            }
            const cookies = await this.page.cookies()
            const [visid, incap] = cookies.filter((cookie) => cookie.name.includes('visid_incap') || cookie.name.includes('incap_ses'))
            const { facility_no: facilityId } = await response.json()
            return {
                facilityId,
                cookie: `${visid.name}=${visid.value}; ${incap.name}=${incap.value};`
            }
        } catch (err) {
            throw err
        }
    }

    private async getSeats(performanceId, cookie) {
        const response = await axios.get(`https://my.5thavenue.org/api/syos/GetScreens?performanceId=${performanceId}`, {
            headers: { cookie }
        })
        if (response.status !== 200 || !response.headers['content-type'].includes('application/json')) {
            throw new Error('Bad Response')
        }

        const GetPerformanceDetailsResponse = await axios.get(`https://my.5thavenue.org/api/syos/GetPerformanceDetails?performanceId=${performanceId}`, {
            headers: { cookie }
        })

        if (GetPerformanceDetailsResponse.status !== 200 || !GetPerformanceDetailsResponse.headers['content-type'].includes('application/json')) {
            throw new Error('Bad Response')
        }

        const availableSeats = response.data.map((seat, index) => ({ id: ++index, isAvailable: seat.Available })).filter(seat => seat.isAvailable).map(({ id }) => id)

        for (const seatId of availableSeats) {
            const { data: data } = await axios.get(`https://my.5thavenue.org/api/syos/GetSeatList?performanceId=${performanceId}&facilityId=${GetPerformanceDetailsResponse.data.facility_no}&screenId=${seatId}`, {
                headers: {
                    cookie
                }
            })
            return data.seats.map(seat => ({
                is_seat: seat.is_seat,
                seat_section: seat.ZoneLabel,
                seat_desc: seat.seat_desc,
                seat_num: seat.seat_num.trim(),
                seat_row: seat.seat_row.trim(),
                seat_status_desc: seat.seat_status_desc,
                seat_type_desc: seat.seat_type_desc,
                xpos: seat.xpos,
                ypos: seat.ypos
            }))
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async getFifthAvenue() {
        try {
            const { productionSeasons, cookie } = await this.getAvailableTickets()
            const shows = productionSeasons.map(data => ({
                performer: data.productionTitle,
                performances: data.performances.map(async performance => ({
                    id: performance.id,
                    performanceDate: performance.performanceDate,
                    link: performance.actionUrl,
                    isOnSale: performance.isOnSale,
                    time: performance.displayTime,
                    seats: await this.getSeats(performance.id, cookie)
                }))
            }))

            for (const show of shows) {
                show.performances = await Promise.all(show.performances)
            }

            // for (const show of shows) {
            //     const performer = this.performerRepo.create({
            //         name: show.performer,
            //         eventType: EventType.THEATER
            //     })
            //     await this.performerRepo.save(performer)

            //     for(const performance of show.performances) {
            //         for(const seat of performance.seats) {
            //             const performer = this.SeatMapRepo.create({
            //                 section: seat.seat_section,
            //                 row: seat.seat_row,
            //                 seat_number: seat.seat_num,

            //             })
            //             await this.performerRepo.save(performer)
            //         }
            //     }

            // }


        } catch (err) {
            throw err
        }
    }
}
