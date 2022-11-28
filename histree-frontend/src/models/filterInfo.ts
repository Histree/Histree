export interface FilterInfo {
  bornBetween: DateRange;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}
