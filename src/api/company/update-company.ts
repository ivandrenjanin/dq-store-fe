import { AxiosInstance } from "axios";
import { CompanyResponse } from "./interfaces/company-response.interface";
import { CreateCompanyDto } from "./interfaces/create-company.dto.interface";

export const updateCompany = async (
  client: AxiosInstance,
  id: number,
  dto: Partial<CreateCompanyDto>
) => {
  try {
    const { data } = await client.patch<CompanyResponse>(`/company/${id}`, dto);
    return data;
  } catch (error) {
    throw error;
  }
};
