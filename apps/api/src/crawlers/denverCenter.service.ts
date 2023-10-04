import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import { Page } from 'playwright';
import to from 'await-to-js';
import fetchBuilder from 'fetch-retry-ts';
import { SkyboxInterface } from './interfaces';
const fetchCookie = require('fetch-cookie');

@Injectable()
export class DenverCenterService {
  private fetch = fetchCookie(fetch);

  // @Cron(CronExpression.EVERY_MINUTE)
  async getSeats() {
    const links = await this.getAllAvailableTicketLinks();
    //Todo: Find a way to use promise.settleAll instead of for loop
    const scrapedData = [];
    for (const link of [links[0]]) {
      const response = await this.fetch(link);
      const text = await response.text();
      const sToken = this.hasSToken(text);
      if (sToken) {
        const searchResults = this.combineThing(
          this.getAllsearchNamesKeys(text),
          this.getAllSearchResults(text),
        );
        const hasNoStartDate = searchResults.find(
          (result) => result?.start_date === '',
        );
        if (hasNoStartDate) {
          const results = await Promise.allSettled(
            this.postPromises(
              'https://tickets.denvercenter.org/Online/default.asp',
              searchResults,
              sToken,
            ),
          );
          for (const response of results) {
            if (response.status === 'rejected') continue;
            const result = await response.value.text();
            const searchResults = this.combineThing(
              this.getAllsearchNamesKeys(result),
              this.getAllSearchResults(result),
            );
            const availableTickets = searchResults.filter(
              (data) => data.availability_num !== '0',
            );

            const results = await Promise.allSettled(
              this.postMapSelect(
                'https://tickets.denvercenter.org/Online/mapSelect.asp',
                availableTickets,
                sToken,
              ),
            );
            for (let index = 0; index < results.length; index++) {
              if (results[index].status === 'rejected') continue;
              const result = await (
                results[index] as PromiseFulfilledResult<Response>
              ).value.text();

              const $ = cheerio.load(result);
              $('#seatGroup circle')
                .toArray()
                .filter((el) => $(el).attr('data-status') === 'A')
                .map((el) => {
                  const seatRow = $(el).attr('data-seat-row');
                  const seatNumber = $(el).attr('data-seat-seat');
                  const seatStatus = $(el).attr('data-status');
                  const seatSection = $(el).attr('data-seat-section');
                  const seatDescription = $(el).attr('data-tsmessage');

                  return {
                    link,
                    short_description:
                      availableTickets[index].short_description,
                    start_date_time: availableTickets[index].start_date_time,
                    start_date_date: availableTickets[index].start_date_date,
                    start_date_month: availableTickets[index].start_date_month,
                    start_date_year: availableTickets[index].start_date_year,
                    street: availableTickets[index].street,
                    city: availableTickets[index].city,
                    state: availableTickets[index].state,
                    zip: availableTickets[index].zip,
                    country: availableTickets[index].country,
                    venue_name: availableTickets[index].venue_name,
                    seatRow,
                    seatNumber,
                    seatStatus,
                    seatSection,
                    seatDescription,
                  };
                })
                .forEach((data) => scrapedData.push(data));
            }
          }
        } else {
          const response = await this.fetch(link);
          const text = await response.text();
          const sToken = this.hasSToken(text);
          if (sToken) {
            const searchResults = this.combineThing(
              this.getAllsearchNamesKeys(text),
              this.getAllSearchResults(text),
            );

            const availableTickets = searchResults.filter(
              (data) => data.availability_num !== '0',
            );

            const results = await Promise.allSettled(
              this.postMapSelect(
                'https://tickets.denvercenter.org/Online/mapSelect.asp',
                availableTickets,
                sToken,
              ),
            );

            for (let index = 0; index < results.length; index++) {
              if (results[index].status === 'rejected') continue;
              const result = await (
                results[index] as PromiseFulfilledResult<Response>
              ).value.text();

              const $ = cheerio.load(result);

              const seatGroupElement = $('#seatGroup circle').toArray();
              const screenMapElement = $('#screenMap > polygon').toArray();

              if (seatGroupElement.length) {
                seatGroupElement
                  .filter((el) => $(el).attr('data-status') === 'A')
                  .map((el) => {
                    const seatRow = $(el).attr('data-seat-row');
                    const seatNumber = $(el).attr('data-seat-seat');
                    const seatStatus = $(el).attr('data-status');
                    const seatSection = $(el).attr('data-seat-section');
                    const seatDescription = $(el).attr('data-tsmessage');

                    return {
                      link,
                      short_description:
                        availableTickets[index].short_description,
                      start_date_time: availableTickets[index].start_date_time,
                      start_date_date: availableTickets[index].start_date_date,
                      start_date_month:
                        availableTickets[index].start_date_month,
                      start_date_year: availableTickets[index].start_date_year,
                      street: availableTickets[index].street,
                      city: availableTickets[index].city,
                      state: availableTickets[index].state,
                      zip: availableTickets[index].zip,
                      country: availableTickets[index].country,
                      venue_name: availableTickets[index].venue_name,
                      seatRow,
                      seatNumber,
                      seatStatus,
                      seatSection,
                      seatDescription,
                    };
                  })
                  .forEach((data) => scrapedData.push(data));
              } else if (screenMapElement.length) {
                $('input[name="sToken"]').val();
                const datas = screenMapElement
                  .filter((el) => !$(el).hasClass('sold_out'))
                  .map((el) => {
                    const id = $(el).attr('id');
                    const performance = $('input[name="performance"]').val();
                    const screens = $('#showScreens').val();
                    const manageAdmissions = $(
                      'input[name="doWork::WSorder::manageAdmissions"]',
                    ).val();
                    const performanceID = $(
                      'input[name="BOparam::WSorder::manageAdmissions::performanceID"]',
                    ).val();

                    return {
                      id,
                      performance,
                      screens,
                      manageAdmissions,
                      performanceID,
                    };
                  });

                const results = await Promise.allSettled(
                  this.postMapSelectBalcony(
                    'https://tickets.denvercenter.org/Online/mapSelect.asp',
                    datas,
                    sToken,
                  ),
                );
                for (let i = 0; i < results.length; i++) {
                  if (results[i].status === 'rejected') continue;
                  const result = await (
                    results[i] as PromiseFulfilledResult<Response>
                  ).value.text();

                  const $ = cheerio.load(result);
                  const seatGroupElement = $('#seatGroup circle').toArray();
                  seatGroupElement
                    .filter((el) => $(el).attr('data-status') === 'A')
                    .map((el) => {
                      const seatRow = $(el).attr('data-seat-row');
                      const seatNumber = $(el).attr('data-seat-seat');
                      const seatStatus = $(el).attr('data-status');
                      const seatSection = $(el).attr('data-seat-section');
                      const seatDescription = $(el).attr('data-tsmessage');
                      return {
                        link,
                        short_description:
                          availableTickets[index].short_description,
                        start_date_time:
                          availableTickets[index].start_date_time,
                        start_date_date:
                          availableTickets[index].start_date_date,
                        start_date_month:
                          availableTickets[index].start_date_month,
                        start_date_year:
                          availableTickets[index].start_date_year,
                        street: availableTickets[index].street,
                        city: availableTickets[index].city,
                        state: availableTickets[index].state,
                        zip: availableTickets[index].zip,
                        country: availableTickets[index].country,
                        venue_name: availableTickets[index].venue_name,
                        seatRow,
                        seatNumber,
                        seatStatus,
                        seatSection,
                        seatDescription,
                      };
                    })
                    .forEach((data) => scrapedData.push(data));
                }
              } else {
                break;
              }
            }
          }
        }
      }
    }
    console.log(scrapedData);
  }

  private postPromises(url, searchResults, sToken) {
    return searchResults
      .filter((data) => data.id)
      .map((data) =>
        this.fetch(url, {
          method: 'POST',
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          },
          body: new URLSearchParams({
            sToken,
            'doWork::WScontent::loadArticle': 'Load',
            'BOparam::WScontent::loadArticle::article_id': data.id,
          }),
        }),
      );
  }

  private postMapSelect(url, searchResults, sToken) {
    return searchResults
      .filter((data) => data.id)
      .map((data) =>
        this.fetch(url, {
          method: 'POST',
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          },
          body: new URLSearchParams({
            sToken,
            'createBO::WSmap': '1',
            'BOparam::WSmap::loadMap::performance_ids': data.id,
          }),
        }),
      );
  }

  private postMapSelectBalcony(url, searchResults, sToken) {
    return searchResults.map((data) =>
      this.fetch(url, {
        method: 'POST',
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        },
        body: new URLSearchParams({
          sToken,
          screens: data.screens,
          'BOparam::WSmap::loadMap::screen_id': data.id,
          performance: data.performance,
          'doWork::WSorder::manageAdmissions': data.manageAdmissions,
          'BOparam::WSorder::manageAdmissions::performanceID':
            data.performanceID,
        }),
      }),
    );
  }

  private hasSToken(text) {
    let hasSToken = text.match(/sToken: "[^]*"};/)[0];
    if (hasSToken) {
      const sToken = hasSToken.substring(
        hasSToken.indexOf('"') + 1,
        hasSToken.lastIndexOf('"'),
      );
      return sToken;
    }
    return '';
  }

  private getAllSearchResults(text) {
    const startIndex =
      text.indexOf('searchResults : [') + 'searchResults : '.length;
    const endIndex = text.indexOf('searchFilters : [');

    if (startIndex !== -1 && endIndex !== -1) {
      const substringBetweenSections = text.substring(startIndex, endIndex);
      const removedComma = substringBetweenSections.substring(
        0,
        substringBetweenSections.lastIndexOf(']') + 1,
      );
      return JSON.parse(removedComma.replaceAll('\\'));
    }
    return [];
  }

  private getAllsearchNamesKeys(text) {
    const startIndex =
      text.indexOf('searchNames : [') + 'searchNames : '.length;
    const endIndex = text.indexOf('searchResults : [');

    if (startIndex !== -1 && endIndex !== -1) {
      const substringBetweenSections = text.substring(startIndex, endIndex);
      const removedComma = substringBetweenSections.substring(
        0,
        substringBetweenSections.lastIndexOf(']') + 1,
      );
      return JSON.parse(removedComma.replaceAll('\\'));
    }
    return [];
  }

  private combineThing(keys, results) {
    const arr = [];
    for (const result of results) {
      const data = result
        .map((data, index) => ({
          [keys[index]]: data,
        }))
        .reduce((prev, curr) => Object.assign(prev, curr));
      arr.push(data);
    }
    return arr;
  }

  private async getAllAvailableTicketLinks() {
    const response = await this.fetch(
      'https://www.denvercenter.org/tickets-events/',
    );
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $('.wpgb-masonry > article')
      .toArray()
      .map((el) => {
        const link = $(el).find('.wpgb-card-footer a').attr('href');
        return fetch(link);
      });

    const ticketLinks = [];
    const results = await Promise.allSettled(links);
    for (const response of results) {
      if (response.status === 'rejected') continue;
      const html = await response.value.text();
      const $ = cheerio.load(html);
      const getTicketButton = $(
        'main[itemprop="mainContentOfPage"] a.avia-button',
      );
      const venue = $('.event_details_header_theatre').text().trim();
      const event = $('.avia_textblock.event_details_title')
        .text()
        .trim()
        .replace(' – ', ' ');

      if (!venue || !event) {
        continue;
      }
      const [errSkyboxResponse, skyBoxResponse] =
        await this.checkIfEventVenueExistOnSkybox(event, venue);

      if (errSkyboxResponse) continue;

      if (skyBoxResponse.rowCount === 0) {
        continue;
      }

      const currentLink = getTicketButton.attr('href');
      if (currentLink && currentLink.includes('doWork::WScontent::')) {
        ticketLinks.push(currentLink);
      }
    }
    return ticketLinks;
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
}
