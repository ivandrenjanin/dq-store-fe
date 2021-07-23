import { AxiosInstance } from "axios";
import { LoginCredentials } from "./interfaces/login-credentials.interface";
import { LoginResponse } from "./interfaces/login-response.interface";

export const login = async (
  client: AxiosInstance,
  dto: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const { data } = await client.post<LoginResponse>("/auth", dto);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
};
