import { AxiosInstance } from "axios";
import { CompanyResponse } from "./interfaces/company-response.interface";

export const getCompany = async (client: AxiosInstance) => {
  try {
    const { data } = await client.get<CompanyResponse>("/company");
    return data;
  } catch (error) {
    throw error;
  }
};
