import { AxiosInstance } from "axios";

import { Inventory } from "../../entities";

export const getInventoryById = async (client: AxiosInstance, id: number) => {
  try {
    const { data } = await client.get<Inventory>(`/inventory/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
