import { AxiosInstance } from "axios";
import { InventoryByIdResponse } from "./interfaces/inventory-by-id-response.interface";

export const getInventoryById = async (client: AxiosInstance, id: number) => {
  try {
    const { data } = await client.get<InventoryByIdResponse>(
      `/inventory/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
