export interface FiftAvenueTickets {
  title: string;
  url: string;
  description: string;
  specialDates: string;
  facility: string;
  prodNumber: number;
  season: string;
  startDate: Date;
  endDate: Date;
  isOnSale: boolean;
  performances: Performance[];
}

export interface Performance {
  perfCode: string;
  perfNo: number;
  date: Date;
  isOnSale: boolean;
  isSoldOut?: boolean;
}
