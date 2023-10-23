import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  async fetchEvents() {
    const access_token = await this.getToken();
    const resEvents = await fetch(
      'https://aiitchtix.net/api/events',
      this.headerOption(access_token),
    );
    return resEvents.json();
  }

  async fetchVenue(venueId: string) {
    const access_token = await this.getToken();
    const res = await fetch(
      `https://aiitchtix.net/api/events/venues/${venueId}?performances=1&skybox=1`,
      this.headerOption(access_token),
    );
    if (!res.ok)
      throw new HttpException('Unable to fetch data', HttpStatus.UNAUTHORIZED);
    return res.json();
  }

  async fetchVenuesEventIdsgetVenue(venueId: string, eventsId: string) {
    const access_token = await this.getToken();
    const res = await fetch(
      `https://aiitchtix.net/api/events/venues/inventory/${venueId}?eventsIds=${eventsId}`,
      this.headerOption(access_token),
    );
    if (!res.ok)
      throw new HttpException('Unable to fetch data', HttpStatus.UNAUTHORIZED);
    return res.json();
  }

  async fetchVenues() {
    const access_token = await this.getToken();
    const res = await fetch(
      'https://aiitchtix.net/api/events/venues?sticky=true',
      this.headerOption(access_token),
    );
    if (!res.ok)
      throw new HttpException('Unable to fetch data', HttpStatus.UNAUTHORIZED);
    const data = await res.json();
    return data
      .map((obj) => {
        delete obj.agent_id;
        delete obj._data;
        delete obj.sticky;

        return obj;
      })
      .slice(0, 10);
  }

  async fetchEventsPerformance(performanceId: string) {
    const access_token = await this.getToken();
    const res = await fetch(
      `https://aiitchtix.net/api/events/performance/${performanceId}`,
      this.headerOption(access_token),
    );
    return res.json();
  }

  async fetchEventsSeats(performanceId: string) {
    const access_token = await this.getToken();
    const res = await fetch(
      `https://aiitchtix.net/api/events/performance/${performanceId}/inventory`,
      this.headerOption(access_token),
    );
    return res.json();
  }

  private headerOption(access_token: string) {
    return {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        Authorization: `Bearer ${access_token}`,
      },
    };
  }

  private async getToken() {
    const res = await fetch('https://aiitchtix.net/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'david',
        password: 'dev',
      }),
    });
    if (!res.ok)
      throw new HttpException('Unable to fetch data', HttpStatus.UNAUTHORIZED);
    const { access_token } = await res.json();
    return access_token;
  }
}
