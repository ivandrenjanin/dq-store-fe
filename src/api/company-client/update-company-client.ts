import { AxiosInstance } from "axios";
import { CreateCompanyClientDto } from "./interfaces/create-company-client.dto.interface";

export const updateCompanyClient = async (
  client: AxiosInstance,
  id: string,
  dto: Partial<CreateCompanyClientDto>
) => {
  try {
    await client.patch(`/company-client/${id}`, { ...dto });
  } catch (error) {
    throw error;
  }
};
