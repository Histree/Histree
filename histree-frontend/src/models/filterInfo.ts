export interface FilterInfo {
  filtered: boolean;
  bornBetween: DateRange;
  diedBetween: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
