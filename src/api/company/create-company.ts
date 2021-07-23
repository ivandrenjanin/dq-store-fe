import { AxiosInstance } from "axios";
import { CompanyResponse } from "./interfaces/company-response.interface";
import { CreateCompanyDto } from "./interfaces/create-company.dto.interface";

export const createCompany = async (
  client: AxiosInstance,
  dto: CreateCompanyDto
) => {
  try {
    const { data } = await client.post<CompanyResponse>("/company", dto);
    return data;
  } catch (error) {
    throw error;
  }
};
