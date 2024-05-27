export const getDayOfWeek = (dateString) => {
  if (!dateString) return '';

  // Parse the date string in yyyy-mm-dd format
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Options to get the abbreviated name of the day
  const options = { weekday: 'short' }; 

  return date.toLocaleDateString('en-US', options);
};
