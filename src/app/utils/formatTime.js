export const formatTime = (timeString) => {
  const time = new Date(timeString);
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return formattedTime;
};