export interface PerformanceDetailsInterface {
  AdditionalText: string;
  AvailablePrices: AvailablePrice[];
  DefaultPrice: any;
  IsSeatMapAvailable: boolean;
  MaxSeats: number;
  OnSale: boolean;
  PerformanceList: PerformanceList[];
  ScreenZoneList: ScreenZoneList[];
  UsingFacebook: boolean;
  ZoneColorList: any[];
  description: string;
  facility_desc: string;
  facility_no: number;
  perf_dt: string;
  perf_no: number;
  pricing: Pricing[];
  prod_no: number;
}

export interface ScreensInterface {
  Available: boolean;
  IsButtonVisible: boolean;
  IsSYOS: boolean;
  MaxPrice: string;
  MinPrice: string;
  PathScreenImage: string;
  PriceType: string;
  RedirectUrl: string;
  SkipScreenSelection: boolean;
  SortOrder: number;
  screen_desc: string;
  screen_no: number;
  smap_no: number;
}

export interface AvailablePrice {
  Price: number;
  ZoneNo: number;
}

export interface PerformanceList {
  CustomProperties: CustomProperties;
  description: any;
  facility_no: number;
  perf_dt: string;
  perf_no: number;
  pricing: any;
}

export interface CustomProperties {}

export interface ScreenZoneList {
  default_price: number;
  screen_no: number;
  zone_no: number;
}

export interface Pricing {
  CustomProperties: CustomProperties2;
  available: boolean;
  description: string;
  price: number;
  price_type: number;
  price_type_desc: string;
  zone_no: number;
  PerSeatFee: number;
  is_default: boolean;
  is_promo: boolean;
  rank: number;
}

export interface CustomProperties2 {}

export interface SeatListType {
  AvailablePrices: AvailablePrice[];
  DefaultPrice: string;
  FacebookFriends: any;
  MaxPrice: number;
  MaxPriceDisplay: string;
  MinPrice: number;
  MinPriceDisplay: string;
  ScreenZoneList: ScreenZoneList[];
  SeatTypes: string[];
  ZoneColorList: ZoneColorList[];
  backgroundImageUrl: string;
  holdCodes: any[];
  seats: Seat[];
  sections: Section[];
  stagePlacement: string;
}

export interface AvailablePrice {
  Price: number;
  ZoneNo: number;
}

export interface ScreenZoneList {
  default_price: number;
  screen_no: number;
  zone_no: number;
}

export interface ZoneColorList {
  IconCharacter: string;
  price: number;
  zone_color: string;
  zone_id: any;
  zone_label: string;
  zone_no: number;
}

export interface Seat {
  CustomProperties: CustomProperties;
  ac_no: number;
  display_letter: string;
  hc_no: number;
  imageURL: any;
  is_seat: boolean;
  line_item_no: any;
  seat_desc: string;
  seat_no: number;
  seat_num: string;
  seat_row: string;
  seat_status: number;
  seat_status_desc: string;
  seat_type: number;
  seat_type_desc: string;
  section: number;
  xpos: number;
  ypos: number;
  zone_no: number;
  CustomFill: string;
  FriendName: any;
  GraphicType: string;
  HoldCode: number;
  IconCharacter: string;
  PictureLink: any;
  SeatSelectionText: string;
  StageOrientation: string;
  ZoneLabel: string;
}

export interface CustomProperties {}

export interface Section {
  CustomProperties: CustomProperties2;
  section: number;
  section_desc: string;
}

export interface CustomProperties2 {}
