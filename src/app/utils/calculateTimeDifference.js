export const calculateTimeDifference = (startTime, endTime, returnHours = false) => {
    // Split the input strings to get hours and minutes
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);

    // Convert start time and end time to minutes
    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    // Calculate the difference in minutes
    let diffMinutes = endTotalMinutes - startTotalMinutes;

    // If the difference is negative, it means end time is on the next day
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours in minutes
    }

    // If returnHours is true, return the difference in hours as a decimal representation
    if (returnHours) {
        return (diffMinutes / 60).toFixed(1);
    }

    // Calculate hours and minutes from the total difference in minutes
    let diffHours = Math.floor(diffMinutes / 60);
    let remainingMinutes = diffMinutes % 60;

    // Convert the remaining minutes to decimal representation
    let decimalMinutes = remainingMinutes / 60;

    // Calculate the total hours including decimal representation of minutes
    let totalHours = diffHours + decimalMinutes;

    // Format the result as a decimal representation of hours rounded to one decimal place
    let result = totalHours.toFixed(1);

    return result;
};


export const calculateTotalTime = (item, calculateBreakHours = false) => {
  if (!item || !item.logs) return '00:00';

  // Calculate total time in milliseconds
  let totalTimeMs = 0;

  item.logs.forEach(log => {
    if (log.startTime && log.endTime) {
      const startTime = new Date(log.startTime);
      const endTime = new Date(log.endTime);

      if (calculateBreakHours) {
        // Check if log status is 'break'
        if (log.status === 'break') {
          totalTimeMs += endTime - startTime;
        }
      } else {
        totalTimeMs += endTime - startTime;
      }
    }
  });

  // Debug: Log the total time in milliseconds
  console.log(`Total time in milliseconds for item ${item.id}:`, totalTimeMs);

  // Convert milliseconds to minutes and hours
  const totalMinutes = Math.floor(totalTimeMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format hours and minutes to ensure two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};
