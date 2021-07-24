import axios, { AxiosError } from "axios";

console.log(process.env);

const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("accessToken");
    request.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(request);
    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error: AxiosError) => {
    if (error.code === "403") {
      // Refresh Token Strategy Implementation
      console.log(error);
      return client;
    } else {
      return Promise.reject(error);
    }
  }
);

export default client;
