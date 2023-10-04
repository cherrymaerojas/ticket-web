export interface SkyboxInterface {
  rows: Row[];
  rowCount: number;
  totals: any;
}

export interface Row {
  id: number;
  name: string;
  date: string;
  venue: Venue;
  performerId: number;
  performer: Performer;
  keywords: string;
  chartUrl: string;
  stubhubEventId: number;
  stubhubEventUrl: any;
  tags: any;
  notes: any;
  eiEventId: number;
  optOutReplenishment: boolean;
  ticketCount: number;
  mySoldTickets: number;
  myCancelledTickets: number;
  disabled: boolean;
  vividSeatsEventUrl: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  timeZone: string;
}

export interface Performer {
  id: number;
  name: string;
  eventType: string;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  eventType: string;
}
