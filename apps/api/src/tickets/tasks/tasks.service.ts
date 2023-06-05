import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import * as _ from 'lodash'
import * as moment from 'moment-timezone'
import { InjectPage } from 'nest-puppeteer'
import type { Page } from 'puppeteer'
import { Repository } from 'typeorm'
import { Event } from '../entities/event.entity'
import { Performance } from '../entities/performance.entity'
import { EventType, Performer } from '../entities/performer.entity'
import { Provider } from '../entities/provider.entity'
import { SeatMap } from '../entities/seatmap.entity'
import { Venue } from '../entities/venue.entity'

type fifthAvenueSeatType = {
    is_seat: boolean
    seat_section: string
    seat_desc: string
    seat_num: string
    seat_row: string
    seat_status_desc: string
    seat_type_desc: string
    xpos: number
    ypos: number
}

type fifthAvenueType = {
    id: number
    performanceDate: string
    link: string
    isOnSale: boolean
    time: string
    seats: fifthAvenueSeatType[]
}
//TODO(lyndon): Clean this spag

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
                        name: title,
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
                const startDate = moment().startOf('month').format('YYYY-MM-DD')
                const endDate = moment().endOf('month').format('YYYY-MM-DD')
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

    private async fetchEventsFromSkyBox() {
        const startDate = moment().startOf('month').format('YYYY-MM-DD')
        const endDate = moment().endOf('month').format('YYYY-MM-DD')
        const event = 'Les%20Miserables'
        const venue = '5th%20avenue'
        const response = await axios.get(`https://skybox.vividseats.com/services/events?event=${event}&venue=${venue}&eventDateFrom=${startDate}&eventDateTo=${endDate}`, {
            headers: {
                Accept: 'application/json',
                'X-Application-Token': process.env.APPLICATION_TOKEN,
                'X-Api-Token': process.env.API_TOKEN,
                'X-Account': process.env.ACCOUNT,
            }
        })

        if (response.status !== 200) {
            throw new Error('Bad Response')
        }
        return response.data.rows.map(event => ({ id: event.id, performanceDate: event.date, name: event.name, venue: event.venue, performer: event.performer }))
    }

    private async fetchSeatsFromSkybox(eventId) {
        const response = await axios.get(`https://skybox.vividseats.com/services/inventory?sortDir=ASC&eventId=${eventId}`, {
            headers: {
                Accept: 'application/json',
                'X-Application-Token': process.env.APPLICATION_TOKEN,
                'X-Api-Token': process.env.API_TOKEN,
                'X-Account': process.env.ACCOUNT,
            }
        })
        if (response.status !== 200) {
            throw new Error('Bad Response')
        }
        return response.data.rows
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
            throw new Error(`Bad Response ${JSON.stringify(GetPerformanceDetailsResponse)}`)
        }

        const availableSeats = response.data.map((seat, index) => ({ id: ++index, isAvailable: seat.Available })).filter(seat => seat.isAvailable).map(({ id }) => id)

        for (const seatId of availableSeats) {
            const { data: data } = await axios.get(`https://my.5thavenue.org/api/syos/GetSeatList?performanceId=${performanceId}&facilityId=${GetPerformanceDetailsResponse.data.facility_no}&screenId=${seatId}`, {
                headers: {
                    cookie
                }
            })
            return data.seats
                .map(seat => ({
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

    @Cron(CronExpression.EVERY_MINUTE)
    async getFifthAvenue() {
        try {
            const { productionSeasons, cookie } = await this.getAvailableTickets()
            const shows = productionSeasons.map(data => ({
                name: data.productionTitle,
                performances: data.performances.map(async performance => ({
                    id: performance.id,
                    performanceDate: performance.iso8601DateString,
                    link: performance.actionUrl,
                    isOnSale: performance.isOnSale,
                    time: performance.displayTime,
                    seats: await this.getSeats(performance.id, cookie)
                }))
            }))
            for (const show of shows) {
                show.performances = await Promise.all(show.performances)
            }
            this.logger.debug('...Starting...')
            const skyboxEvents = await this.fetchEventsFromSkyBox()
            for (const skyboxEvent of skyboxEvents) {
                const seats = await this.fetchSeatsFromSkybox(skyboxEvent.id)
                for (const seat of seats) {
                    let venue = await this.venueRepo.findOneBy({ name: seat.event.venue.name })
                    if (!venue) {
                        const { name, address, city, state, country, phone, timeZone, postalCode } = seat.event.venue
                        venue = this.venueRepo.create({
                            name,
                            address,
                            city,
                            state,
                            country,
                            phone,
                            timezone: timeZone,
                            postal_code: postalCode
                        })
                        await this.venueRepo.save(venue)
                    }
                    let provider = await this.providerRepo.findOneBy({ name: seat.event.venue.name })
                    if (!provider) {
                        const { name } = seat.event.venue
                        provider = this.providerRepo.create({
                            name
                        })
                        await this.providerRepo.save(provider)
                    }
                    let performer = await this.performerRepo.findOneBy({ name: seat.event.performer.name })
                    if (!performer) {
                        const { name, eventType } = seat.event.performer
                        performer = this.performerRepo.create({
                            name,
                            eventType: EventType[eventType]
                        })
                        await this.performerRepo.save(performer)
                    }
                    let performance = await this.performanceRepo.findOneBy({ name: seat.event.performer.name })
                    if (!performance) {
                        const { name } = seat.event.performer
                        performance = this.performanceRepo.create({
                            name,
                            performer,
                            venue,
                            provider
                        })
                        await this.performanceRepo.save(performance)
                    } else {
                        await this.performanceRepo.save({
                            ...performance,
                            performer,
                            venue,
                            provider
                        })
                    }
                    // compare with scrape
                    const eventScrape = shows
                        .filter(show => show.name === performer.name)
                        .map(show => ({
                            ...show,
                            performances: show.performances.find(performance => performance.performanceDate === seat.event.date)
                        }))
                        .reduce((acc, cur) => cur)

                    if (!eventScrape.performances) {
                        //Skybox data does not match in scrape
                        // let event = await this.eventRepo.findOneBy({ date: seat.event.date })
                        // for (const seat_number of seat.seatNumbers.split(",")) {
                        //     let seatMap = await this.SeatMapRepo.findOne({
                        //         where: {
                        //             event: { id: event.id },
                        //             section: seat.section,
                        //             row: seat.row,
                        //             seat_number
                        //         }
                        //     })
                        //     await this.SeatMapRepo.save({
                        //         ...seatMap,
                        //         in_skybox: false
                        //     })
                        // }
                    } else {
                        let event = await this.eventRepo.findOneBy({ date: seat.event.date })
                        if (!event) {
                            const { date } = seat.event
                            event = this.eventRepo.create({
                                date,
                                performance,
                                skybox_link: '',
                                ticket_link: eventScrape.performances.link
                            })
                            await this.eventRepo.save(event)
                        } else {
                            await this.eventRepo.save({
                                ...event,
                                skybox_link: '',
                                ticket_link: eventScrape.performances.link
                            })
                        }

                        for (const seat_number of seat.seatNumbers.split(",")) {
                            let seatMap = await this.SeatMapRepo.findOne({
                                where: {
                                    event: { id: event.id },
                                    section: seat.section,
                                    row: seat.row,
                                    seat_number
                                }
                            })
                            if (!seatMap) {
                                seatMap = await this.SeatMapRepo.create({
                                    event,
                                    section: seat.section,
                                    row: seat.row,
                                    seat_number,
                                    unit_price: 0,
                                    in_skybox: true,
                                    broadcast: seat.broadcast,
                                })
                                await this.SeatMapRepo.save(seatMap)
                            } else {
                                await this.SeatMapRepo.save({
                                    ...seatMap,
                                    broadcast: seat.broadcast,
                                })
                            }
                        }
                    }
                }
            }

            for (const show of shows) {
                if (skyboxEvents.some(events => events.name === show.name)) {
                    const filteredEvents = skyboxEvents.filter(events => events.name === show.name)
                    const notPresentInSkybox = _.differenceBy<fifthAvenueType, string>(show.performances, filteredEvents, 'performanceDate')
                    if (notPresentInSkybox.length) {
                        for (const notPresent of notPresentInSkybox) {
                            const skyboxEvent = filteredEvents.find(event => event.name === show.name)
                            // const venue = await this.venueRepo.findOneBy({ name: skyboxEvent.venue.name })
                            // const provider = await this.providerRepo.findOneBy({ name: skyboxEvent.venue.name })
                            // const performer = await this.performerRepo.findOneBy({ name: skyboxEvent.performer.name })
                            const performance = await this.performanceRepo.findOneBy({ name: skyboxEvent.performer.name })
                            let event = await this.eventRepo.findOneBy({ date: notPresent.performanceDate })
                            if (!event) {
                                event = this.eventRepo.create({
                                    date: notPresent.performanceDate,
                                    performance,
                                    skybox_link: '',
                                    ticket_link: notPresent.link
                                })
                                await this.eventRepo.save(event)
                            } else {
                                await this.eventRepo.save({
                                    ...event,
                                    skybox_link: '',
                                })
                            }
                            for (const seat of notPresent.seats) {
                                let seatMap = await this.SeatMapRepo.findOne({
                                    where: {
                                        event: { id: event.id },
                                        section: seat.seat_section,
                                        row: seat.seat_row,
                                        seat_number: seat.seat_num
                                    }
                                })
                                if (!seatMap) {
                                    seatMap = await this.SeatMapRepo.create({
                                        event,
                                        section: seat.seat_section,
                                        row: seat.seat_row,
                                        seat_number: seat.seat_num,
                                        unit_price: 0,
                                        in_skybox: false,
                                        broadcast: false,
                                    })
                                    await this.SeatMapRepo.save(seatMap)
                                } else {
                                    ///
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            throw err
        }
    }
}
