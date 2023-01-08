export interface FilterInfo {
  filtered: boolean;
  bornBetween: DateRange;
  diedBetween: DateRange;
  hasChildren: SwitchType;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type SwitchType = boolean | undefined;
