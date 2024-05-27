export const formatDate = (dateString) => {
  if (!dateString) return '';

  // Parse the date string
  const date = new Date(dateString);
  
  // Check if date parsing was successful
  if (isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}`;
};
