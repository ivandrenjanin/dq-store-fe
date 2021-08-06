import { AxiosInstance } from "axios";
import { CompanyClient } from "../../entities";

export const getCompanyClients = async (
  client: AxiosInstance
): Promise<CompanyClient[]> => {
  try {
    const { data } = await client.get("/company-client");
    return data;
  } catch (error) {
    throw error;
  }
};
