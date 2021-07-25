import { AxiosInstance } from "axios";
import { InventoryResponse } from "./interfaces/inventory-response.interface";

export const getInventories = async (client: AxiosInstance) => {
  try {
    const { data } = await client.get<InventoryResponse[]>("/inventory");
    return data;
  } catch (error) {
    throw error;
  }
};
