export const calculateWage = (startTime, endTime, logStatus, hourlyRate) => {
  if (logStatus.toLowerCase() === 'break') {
    return '-';
  }

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Calculate the difference in minutes
  let minutesWorked = endTotalMinutes - startTotalMinutes;

  // If the end time is before the start time, assume it crosses midnight
  if (minutesWorked < 0) {
    minutesWorked += 24 * 60;
  }

  // Separate the hours and minutes
  const hoursWorked = Math.floor(minutesWorked / 60);
  const remainingMinutes = minutesWorked % 60;

  // Convert remaining minutes to a decimal part of an hour
  const decimalMinutes = (remainingMinutes / 60).toFixed(2);

  // Combine hours and decimal minutes
  const totalHoursWorked = hoursWorked + parseFloat(decimalMinutes);

  // Calculate the wage
  const wage = totalHoursWorked * hourlyRate;
  return '$' + wage.toFixed(2); // Round to 2 decimal places
};

export const calculateTotalWage = (id, data) => {
    let wageTotal = 0;
    for (let elem of data) {
        if (id === elem.userId) {
            wageTotal += parseFloat(elem.totalWage);
        }
    }
  return wageTotal.toFixed(2);
}