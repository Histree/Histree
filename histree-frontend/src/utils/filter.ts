import { FilterInfo, NodeInfo } from "../models";

export const matchesFilter = (info: NodeInfo, filters: FilterInfo): boolean => {
  if (!filters.filtered) {
    return true;
  }

  let matchesFilter = false;
  const petals = info.petals;

  if (petals) {
    if (petals.date_of_birth) {
      const birthDate = new Date(petals.date_of_birth);
      const bornBetweenStart = filters.bornBetween.startDate;
      const bornBetweenEnd = filters.bornBetween.endDate;

      if (bornBetweenStart !== "") {
        const startDate = new Date(bornBetweenStart);

        matchesFilter = birthDate >= startDate;

        if (bornBetweenEnd !== "") {
          const endDate = new Date(bornBetweenEnd);
          matchesFilter = matchesFilter && birthDate <= endDate;
        }
      } else if (bornBetweenEnd !== "") {
        const endDate = new Date(bornBetweenEnd);
        matchesFilter = birthDate <= endDate;
      }
    }
  }
  return matchesFilter;
};
