import axios from 'axios';

export const fetchData = async (url, setData) => {
  try {
    const response = await axios.get(url);
    console.log(response.data.body.reports);
    const updatedData = [...response.data.body.reports];
    setData(updatedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};