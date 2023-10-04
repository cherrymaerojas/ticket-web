import fetch from 'node-fetch-cookies';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import playwright, { Page } from 'playwright';
const puppeteer = require('puppeteer-core');
import { InjectPage } from 'nestjs-playwright';
import to from 'await-to-js';
import fetchBuilder, { FetchRetryParams } from 'fetch-retry-ts';

import {
  PerformanceDetailsInterface,
  ScreensInterface,
  SeatListType,
  SkyboxInterface,
} from './interfaces';
import { FiftAvenueTickets } from './interfaces/fifthAvenue.interface';

//TODO: Cookie issue
@Injectable()
export class FiftAvenueService {
  // private readonly cookieJar = new nodeFetch.CookieJar();
  private readonly logger = new Logger(FiftAvenueService.name);
  // constructor(@InjectPage() private readonly page: Page) {}

  @Cron(CronExpression.EVERY_HOUR)
  async getFiftAvenueSeats() {
    try {
      console.log('start..');
      // const cookie = await this.getCookieViaBrowser();
      const seats = await this.fetchSeats();
      console.log(seats.length);
    } catch (err) {
      console.log(err);
    }
  }

  private async fetchSeats() {
    const events = await this.fetchAllAvailableEvents();
    const seats = [];
    try {
      for (const event of events) {
        const performancePromises = event.performances.map((performance) =>
          this.fetchPerformanceDetails(performance.perfNo),
        );

        const performances = await Promise.allSettled(performancePromises);
        const listOfPerformanceIds: { id: number; facilityId: number }[] = [];
        for (const performance of performances) {
          if (performance.status === 'rejected') continue;
          const [err, { description, facility_desc, perf_no, facility_no }] =
            performance.value;
          if (err) continue;

          const [errSkyboxResponse, skyBoxResponse] =
            await this.checkIfEventVenueExistOnSkybox(
              description,
              facility_desc,
            );

          if (errSkyboxResponse) continue;
          if (skyBoxResponse.rowCount === 0) {
            continue;
          }
          listOfPerformanceIds.push({ id: perf_no, facilityId: facility_no });
        }

        const results = await this.fetchListSeats(listOfPerformanceIds);

        const seatLists = await this.fetchSeatList(
          results,
          listOfPerformanceIds,
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
                // validLink: links[i],
                // link: eventLink,
                seat_no,
                seat_status_desc,
                seat_num: seat_num.trim(),
                seat_row: seat_row.trim(),
                section_desc,
              };
            });
          test.forEach((seat) => seats.push(seat));
        }
      }
    } catch (error) {
      console.log(error);
    }
    return seats;
  }

  private async fetchSeatList(
    listSeats: ScreensInterface[][],
    listOfPerformanceIds: {
      id: number;
      facilityId: number;
    }[],
  ): Promise<SeatListType[]> {
    try {
      const seatLists: SeatListType[] = [];
      for (let index = 0; index < listSeats.length; index++) {
        const availableScreensPromises = listSeats[index]
          .filter((screen) => screen.Available)
          .map((screen) => {
            const { screen_no } = screen;
            return this.getSeatList(
              listOfPerformanceIds[index].id,
              listOfPerformanceIds[index].facilityId,
              screen_no,
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
    listOfPerformanceIds: {
      id: number;
      facilityId: number;
    }[],
  ): Promise<ScreensInterface[][]> {
    try {
      const listOfPerformanceIdsPromises = listOfPerformanceIds.map(
        (performance) => this.getScreens(performance.id),
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
    performanceId: number,
  ): Promise<[Error, undefined] | [null, PerformanceDetailsInterface]> {
    try {
      const response = await this.getPerformanceDetails(performanceId);
      console.log(response);
      const data = await to<PerformanceDetailsInterface>(response.json());
      return data;
    } catch (error) {
      throw new Error(`Unable to fetch PerformanceDetails ${error}`);
    }
  }

  private fetchViaJson(url: string) {
    const retryFetch: (
      input: RequestInfo | URL,
      init?: RequestInit & FetchRetryParams,
    ) => Promise<Response> = fetchBuilder(fetch, {
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
        'sec-ch-ua': '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        'content-type': 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        accept: 'application/json, text/javascript, */*; q=0.01',
      },
    });
  }

  private getPerformanceDetails(performanceId: number) {
    return this.fetchViaJson(
      `https://my.5thavenue.org/api/syos/GetPerformanceDetails?performanceId=${performanceId}`,
    );
  }

  private getScreens(performanceId: number) {
    return this.fetchViaJson(
      `https://my.5thavenue.org/api/syos/GetScreens?performanceId=${performanceId}`,
    );
  }

  private getSeatList(
    performanceId: number,
    facilityId: number,
    screenId: number,
  ) {
    return this.fetchViaJson(
      `https://my.5thavenue.org/api/syos/GetSeatList?performanceId=${performanceId}&facilityId=${facilityId}&screenId=${screenId}`,
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
    //NOTE: Return 403 despite using proxy
    const SBR_WS_ENDPOINT =
      'wss://brd-customer-hl_ba826f94-zone-scraping_browser:dy1uqpjftn5y@brd.superproxy.io:9222';
    const browser = await puppeteer.connect({
      browserWSEndpoint: SBR_WS_ENDPOINT,
    });
    try {
      const page = await browser.newPage();
      // const RESOURCE_EXCLUSTIONS = ['image', 'media', 'font', 'other'];
      // await page.route('**/*', (route) => {
      //   return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
      //     ? route.abort()
      //     : route.continue();
      // });
      // let cookie = '';
      // var cookies = await page.context().cookies();
      await page.goto('https://google.com');
      // console.log(`cookie ${cookies}`);
      return 'cookie';
    } catch (err) {
      throw Error('Error on using browser ' + err);
    } finally {
      await browser.close();
    }
  }

  private async fetchAllAvailableEvents(): Promise<FiftAvenueTickets[]> {
    const mosResponse = await fetch('https://www.5thavenue.org/tessapi/user');
    if (!mosResponse.ok) {
      throw new Error('Unable to fetch /tessapi/user');
    }
    const { modeOfSale } = await mosResponse.json();
    const response = await fetch(
      `https://www.5thavenue.org/tessapi/tickets/productions?mos=${modeOfSale}`,
    );
    if (!response.ok) {
      throw new Error('Unable to fetch /tessapi/tickets/productions');
    }
    const data: FiftAvenueTickets[] = await response.json();
    return data;
  }
}
