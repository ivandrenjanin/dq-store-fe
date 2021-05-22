import client from "../client/client";
import { ILoginCredentials } from "./interfaces/login-credentials.interface";
import { ILoginResponse } from "./interfaces/login-response.interface";

export const login = async (
  dto: ILoginCredentials
): Promise<ILoginResponse> => {
  try {
    const { data } = await client.post<ILoginResponse>("/auth", dto);
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
};
