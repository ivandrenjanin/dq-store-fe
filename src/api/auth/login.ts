import { AxiosInstance } from "axios";
import { ILoginCredentials } from "./interfaces/login-credentials.interface";
import { ILoginResponse } from "./interfaces/login-response.interface";

export const login = async (
  client: AxiosInstance,
  dto: ILoginCredentials
): Promise<ILoginResponse> => {
  try {
    const { data } = await client.post<ILoginResponse>("/auth", dto);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
