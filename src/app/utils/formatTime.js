export const formatTime = (timeString, showAMandPM = false) => {
  const time = new Date(timeString);
  let formattedTime;

  if (showAMandPM) {
    formattedTime = time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase();
  } else {
    formattedTime = time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  return formattedTime;
};
