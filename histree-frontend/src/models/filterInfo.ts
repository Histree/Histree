export interface FilterInfo {
  filtered: boolean;
  bornBetween: DateRange;
  diedBetween: DateRange;
  searchTerm: TextType;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type SwitchType = boolean | undefined;
export type TextType = string | undefined;
