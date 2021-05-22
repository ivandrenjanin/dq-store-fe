import axios, { AxiosError } from "axios";
console.log(process.env);
const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

client.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("accessToken");
    request.headers = {
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        Authorization: `Bearer ${token}`,
      },
    };

    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "403") {
      console.log(error);
      return client;
    } else {
      return Promise.reject(error);
    }
  }
);

export default client;
