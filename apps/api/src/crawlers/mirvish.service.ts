import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import { Page } from 'playwright';
import to from 'await-to-js';
import fetchBuilder from 'fetch-retry-ts';

import {
  PerformanceDetailsInterface,
  ScreensInterface,
  SkyboxInterface,
  SeatListType,
} from './interfaces/';
import { InjectPage } from 'nestjs-playwright';

@Injectable()
export class MirvishService {
  constructor(@InjectPage() private readonly page: Page) {}

  // @Cron(CronExpression.EVERY_HOUR)
  async getMirvishSeats() {
    try {
      const cookie = await this.getCookieViaBrowser();
      if (cookie) {
        const seats = await this.fetchSeats(cookie);
        console.log(seats.length);
      }
    } catch (err) {
      console.log(err);
    }
  }

  private async fetchSeats(cookie: string) {
    const links = await this.getAllAvailableTicketLinks();
    const linkPromises = links.map((link) => fetch(link));
    const seats = [];
    try {
      for (let i = 0; i < linkPromises.length; i++) {
        const response = await linkPromises[i];
        const html = await response.text();
        const performanceId = this.getPerformanceId(html);
        if (performanceId.length) {
          const eventLink = this.getEventLink(html);
          const [err, data] = await this.fetchPerformanceDetails(
            performanceId,
            cookie,
          );
          if (err) continue;
          const {
            facility_no: facilityId,
            description,
            facility_desc,
            PerformanceList: performanceList,
          } = data;

          const [errSkyboxResponse, skyBoxResponse] =
            await this.checkIfEventVenueExistOnSkybox(
              description,
              facility_desc,
            );

          if (errSkyboxResponse) continue;

          if (skyBoxResponse.rowCount === 0) {
            continue;
          }

          const listOfPerformanceIds = performanceList
            .map((performanceId) => performanceId.perf_no)
            .concat(+performanceId);

          const results = await this.fetchListSeats(
            listOfPerformanceIds,
            cookie,
          );

          const seatLists = await this.fetchSeatList(
            results,
            listOfPerformanceIds,
            facilityId,
            cookie,
          );

          for (const seatList of seatLists) {
            const test = seatList.seats
              .filter((seat) => seat.seat_status_desc !== 'Unavailable')
              .filter(
                (seat) =>
                  !!seatList.sections.find((a) => a.section === seat.section),
              )

              .map((seat) => {
                const { section_desc } = seatList.sections.find(
                  (section) => section.section === seat.section,
                );
                const { seat_no, seat_num, seat_row, seat_status_desc } = seat;
                return {
                  validLink: links[i],
                  link: eventLink,
                  seat_no,
                  seat_status_desc,
                  seat_num: seat_num.trim(),
                  seat_row: seat_row.trim(),
                  section_desc,
                };
              });
            test.forEach((seat) => seats.push(seat));
          }
        } else {
          continue;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return seats;
  }

  private async fetchSeatList(
    listSeats: ScreensInterface[][],
    listOfPerformanceIds: number[],
    facilityId: number,
    cookie: string,
  ): Promise<SeatListType[]> {
    try {
      const seatLists: SeatListType[] = [];
      for (let index = 0; index < listSeats.length; index++) {
        const availableScreensPromises = listSeats[index]
          .filter((screen) => screen.Available)
          .map((screen) => {
            const { screen_no } = screen;
            return this.getSeatList(
              listOfPerformanceIds[index],
              facilityId,
              screen_no,
              cookie,
            );
          });
        const reponses = await Promise.allSettled(availableScreensPromises);
        for (const response of reponses) {
          if (response.status === 'rejected') continue;
          const result = (response as PromiseFulfilledResult<Response>).value;
          const [err, datas] = await to<SeatListType>(result.json());
          if (err) continue;
          seatLists.push(datas);
        }
      }
      return seatLists;
    } catch (error) {
      throw new Error('Unable to fetch SeatsLists');
    }
  }

  private async fetchListSeats(
    listOfPerformanceIds: number[],
    cookie: string,
  ): Promise<ScreensInterface[][]> {
    try {
      const listOfPerformanceIdsPromises = listOfPerformanceIds.map(
        (performanceId) => this.getScreens(performanceId, cookie),
      );

      const responses = await Promise.allSettled(listOfPerformanceIdsPromises);
      const listSeats: ScreensInterface[][] = [];
      for (let index = 0; index < responses.length; index++) {
        if (responses[index].status === 'rejected') continue;
        const response = (responses[index] as PromiseFulfilledResult<Response>)
          .value;
        const [err, datas] = await to<ScreensInterface[]>(response.json());
        if (err) continue;
        listSeats.push(datas);
      }
      return listSeats;
    } catch (error) {
      throw new Error('Unable to fetch all performanceId screens');
    }
  }

  private async fetchPerformanceDetails(
    performanceId: string,
    cookie: string,
  ): Promise<[Error, undefined] | [null, PerformanceDetailsInterface]> {
    try {
      const response = await this.getPerformanceDetails(performanceId, cookie);
      const data = await to<PerformanceDetailsInterface>(response.json());
      return data;
    } catch (error) {
      throw new Error(`Unable to fetch PerformanceDetails ${error}`);
    }
  }

  private getEventLink(html: string) {
    const $ = cheerio.load(html);
    return $('.tickets a').attr('href');
  }

  private getPerformanceId(html: string) {
    const $ = cheerio.load(html);
    const buyTicketLink = $('.tickets a').attr('href');
    if (buyTicketLink) {
      const performanceId = buyTicketLink.substring(
        buyTicketLink.lastIndexOf('/') + 1,
      );

      return performanceId;
    }
    return '';
  }

  private async getAllAvailableTicketLinks() {
    const link = 'https://www.mirvish.com';
    const response = await fetch(link);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("ul[aria-labelledby='nav_shows'] a")
      .toArray()
      .map((el) => link + $(el).attr('href'));

    return links;
  }

  private fetchViaJson(url: string, cookie: string) {
    const retryFetch = fetchBuilder(fetch, {
      retries: 3,
      retryDelay: 5000,
      // Retry on any 5xx Error
      retryOn: (
        attempt: number,
        retries: number,
        error: Error | null,
        response: Response | null,
      ): boolean =>
        attempt < retries && (!!error || !response || response.status >= 500),
    });
    return retryFetch(url, {
      headers: {
        'content-type': 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        accept: 'application/json, text/javascript, */*; q=0.01',
        cookie,
      },
    });
  }

  private getPerformanceDetails(performanceId: string, cookie: string) {
    return this.fetchViaJson(
      `https://tickets.mirvish.com/api/syos/GetPerformanceDetails?performanceId=${performanceId}`,
      cookie,
    );
  }

  private getScreens(performanceId: number, cookie: string) {
    return this.fetchViaJson(
      `https://tickets.mirvish.com/api/syos/GetScreens?performanceId=${performanceId}`,
      cookie,
    );
  }

  private getSeatList(
    performanceId: number,
    facilityId: number,
    screenId: number,
    cookie: string,
  ) {
    return this.fetchViaJson(
      `https://tickets.mirvish.com/api/syos/GetSeatList?performanceId=${performanceId}&facilityId=${facilityId}&screenId=${screenId}`,
      cookie,
    );
  }

  private async checkIfEventVenueExistOnSkybox(
    event: string,
    venue: string,
    limit = 1,
  ): Promise<[Error, undefined] | [null, SkyboxInterface]> {
    try {
      const response = await fetch(
        `https://skybox.vividseats.com/services/events?event=${encodeURI(
          event,
        )}&venue=${encodeURI(venue)}&limit=${limit}`,
        {
          headers: {
            accept: 'application/json',
            'X-Application-Token': '98e15ea8-c8a1-470f-96b1-7a8e8b123da5',
            'X-Api-Token': '8742e7a0-b363-432c-ade4-ac2ab7f302ea',
            'X-Account': '2072',
          },
        },
      );

      const data = await to<SkyboxInterface>(response.json());
      return data;
    } catch (error) {
      throw new Error('Unable to check on SkyboxAPI');
    }
  }

  private async getCookieViaBrowser() {
    try {
      const RESOURCE_EXCLUSTIONS = ['image', 'media', 'font', 'other'];
      await this.page.route('**/*', (route) => {
        return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
          ? route.abort()
          : route.continue();
      });
      let cookie = '';
      this.page.on('request', async (request) => {
        const header = await request.allHeaders();
        if (
          !!header &&
          header.hasOwnProperty('cookie') &&
          header.cookie.includes('___utmvc')
        ) {
          cookie = header.cookie;
        }
      });
      await this.page.goto(
        'https://tickets.mirvish.com/jagged/19238?queueittoken=e_gensafe~q_d426f817-16b9-4412-ba3d-d05d3eba49b1~ts_1695659656~ce_true~rt_safetynet~h_343db672a3f9e4fed2e22234d108bec5f0f8395f9d35eb355fc1b9779701ae73',
      );
      return cookie;
    } catch (err) {
      throw Error('Error on using browser ' + err);
    }
  }
}
