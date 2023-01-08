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

      matchesFilter = bornBetweenStart === "" && bornBetweenEnd === "";
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

    if (petals.date_of_death) {
      const deathDate = new Date(petals.date_of_death);
      const diedBetweenStart = filters.diedBetween.startDate;
      const diedBetweenEnd = filters.diedBetween.endDate;

      if (diedBetweenStart !== "") {
        const startDate = new Date(diedBetweenStart);

        matchesFilter = matchesFilter && deathDate >= startDate;

        if (diedBetweenEnd !== "") {
          const endDate = new Date(diedBetweenEnd);
          matchesFilter = matchesFilter && deathDate <= endDate;
        }
      } else if (diedBetweenEnd !== "") {
        const endDate = new Date(diedBetweenEnd);
        matchesFilter = matchesFilter && deathDate <= endDate;
      }
    }
  }
  return matchesFilter;
};

export const isFilterEnabled = (filters: FilterInfo): boolean => {
  return (
    filters.bornBetween.startDate !== "" ||
    filters.bornBetween.endDate !== "" ||
    filters.diedBetween.startDate !== "" ||
    filters.diedBetween.endDate !== ""
  );
};
