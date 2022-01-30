import { AxiosInstance } from "axios";

import { Inventory } from "../../entities";
import { CreateInventoryDto } from "./interfaces/create-inventory.dto.interface";

export const createInventory = async (
  client: AxiosInstance,
  dto: CreateInventoryDto
) => {
  try {
    const { data } = await client.post<
      Pick<Inventory, "id" | "name" | "publicId" | "createdAt" | "updatedAt">
    >("/inventory", dto);
    return data;
  } catch (error) {
    throw error;
  }
};
