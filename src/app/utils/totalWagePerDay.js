import { calculateWage } from "./calculateWage";
import { formatTime } from "./formatTime";

export const totalWagePerDay = (hourlyRate, logs) => {
  let totalWage = 0;

  logs.forEach(log => {
    const { startTime, endTime, status } = log;
    const wageWithDollarSign = calculateWage(formatTime(startTime), formatTime(endTime), status, hourlyRate);

    // Remove the dollar sign if present
    const wage = wageWithDollarSign.replace('$', '');

    // Check if calculateWage returns '-' and skip adding it to totalWage
    if (wage !== '-') {
      totalWage += parseFloat(wage);
    }
  });

  return '$' + (totalWage.toFixed(2)); // Round to 2 decimal places and format
};
