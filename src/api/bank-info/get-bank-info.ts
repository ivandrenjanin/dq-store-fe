import { AxiosInstance } from "axios";

import { BankInfo } from "../../entities";

export const getBankInfo = async (
  client: AxiosInstance
): Promise<BankInfo[]> => {
  try {
    const { data } = await client.get("/bank-info");
    return data;
  } catch (error) {
    throw error;
  }
};
