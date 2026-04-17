import axios from "axios";

export const scanWebsite = async (url: string) => {
  const res = await axios.post("http://127.0.0.1:5000/api/scan", {
    url,
  });
  return res.data;
};