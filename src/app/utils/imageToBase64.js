export const getBase64ImageFromURL = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
