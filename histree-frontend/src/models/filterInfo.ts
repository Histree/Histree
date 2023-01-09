export interface FilterInfo {
  filtered: boolean;
  bornBetween: DateRangeType;
  diedBetween: DateRangeType;
  searchTerm: TextType;
  marriageStatus: ToggleType;
}

export interface DateRangeType {
  startDate: string;
  endDate: string;
}

export type SwitchType = boolean | undefined;
export type TextType = string | undefined;
export type ToggleType = string;
