import { AxiosInstance } from "axios";

import { CreateCompanyClientDto } from "./interfaces/create-company-client.dto.interface";

export const createCompanyClient = async (
  client: AxiosInstance,
  dto: CreateCompanyClientDto
) => {
  try {
    const { data } = await client.post("/company-client", { ...dto });
    return data;
  } catch (error) {
    throw error;
  }
};
