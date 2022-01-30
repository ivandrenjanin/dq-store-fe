import { AxiosInstance } from "axios";

import { Company } from "../../entities";
import { CreateCompanyDto } from "./interfaces/create-company.dto.interface";

export const createCompany = async (
  client: AxiosInstance,
  dto: CreateCompanyDto
) => {
  try {
    const { data } = await client.post<Company>("/company", dto);
    return data;
  } catch (error) {
    throw error;
  }
};
