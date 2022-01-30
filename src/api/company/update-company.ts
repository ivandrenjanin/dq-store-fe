import { AxiosInstance } from "axios";

import { Company } from "../../entities";
import { CreateCompanyDto } from "./interfaces/create-company.dto.interface";

export const updateCompany = async (
  client: AxiosInstance,
  id: number,
  dto: Partial<CreateCompanyDto>
) => {
  try {
    const { data } = await client.patch<Company>(`/company/${id}`, dto);
    return data;
  } catch (error) {
    throw error;
  }
};
