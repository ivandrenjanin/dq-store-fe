import { AxiosInstance } from "axios";

import { Company } from "../../entities";

export const getCompany = async (client: AxiosInstance) => {
  try {
    const { data } = await client.get<Company>("/company");
    return data;
  } catch (error) {
    throw error;
  }
};
