export interface FilterInfo {
  filtered: boolean;
  bornBetween: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
