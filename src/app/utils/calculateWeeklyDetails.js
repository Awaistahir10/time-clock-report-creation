import { getWeekOfMonth } from "./getWeekOfMonth";
import { millisecondsToHHMM } from "./millisecondsToHHMM";

export const calculateWeeklyTrackedHours = (userId, data) => {
  const weeklyHours = {};

  data.forEach(item => {
    if (item.userId === userId) {
      const week = getWeekOfMonth(item.date);

      if (!weeklyHours[week]) {
        weeklyHours[week] = 0;
      }

      weeklyHours[week] += item.totalActiveTime;
    }
  });

  const weeklyHoursFormatted = {};

  for (const week in weeklyHours) {
    if (weeklyHours.hasOwnProperty(week)) {
      weeklyHoursFormatted[week] = millisecondsToHHMM(weeklyHours[week]);
    }
  }

  return weeklyHoursFormatted;
};

export const calculateCompleteHours = (id, data) => {
    let totalHours = 0;
    for (let elem of data) {
        if (id === elem.userId) {
            totalHours += elem.totalActiveTime;
        }
    }
    return millisecondsToHHMM(totalHours)
}

export const calculateWeeklyBreakHours = (userId, data) => {
  const weeklyBreakHours = {};

  data.forEach(item => {
    if (item.userId === userId) {
      const week = getWeekOfMonth(item.date);

      if (!weeklyBreakHours[week]) {
        weeklyBreakHours[week] = 0;
      }

      weeklyBreakHours[week] += item.totalBreakTime;
    }
  });

  const weeklyBreakHoursFormatted = {};

  for (const week in weeklyBreakHours) {
    if (weeklyBreakHours.hasOwnProperty(week)) {
      weeklyBreakHoursFormatted[week] = millisecondsToHHMM(weeklyBreakHours[week]);
    }
  }

  return weeklyBreakHoursFormatted;
};


export const calculateWeeklyWage = (userId, data) => {
  const weeklyWages = {};

  data.forEach(item => {
    if (item.userId === userId) {
      const week = getWeekOfMonth(item.date);

      if (!weeklyWages[week]) {
        weeklyWages[week] = 0;
      }

      weeklyWages[week] += parseFloat(item.totalWage);
    }
  });

  return weeklyWages;
};
