import { AxiosInstance } from "axios";
import { CreateInventoryDto } from "./interfaces/create-inventory.dto.interface";
import { InventoryResponse } from "./interfaces/inventory-response.interface";

export const createInventory = async (
  client: AxiosInstance,
  dto: CreateInventoryDto
) => {
  try {
    const { data } = await client.post<InventoryResponse>("/inventory", dto);
    return data;
  } catch (error) {
    throw error;
  }
};
