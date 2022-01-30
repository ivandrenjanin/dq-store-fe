import axios, { AxiosError } from "axios";

export const createClient = () => {
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

      return request;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.code === "403") {
        // Refresh Token Strategy Implementation
        return client;
      } else {
        return Promise.reject(error);
      }
    }
  );
  return client;
};
