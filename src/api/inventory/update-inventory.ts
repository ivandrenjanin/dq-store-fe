import { AxiosInstance } from "axios";

import { Inventory } from "../../entities";
import { CreateInventoryDto } from "./interfaces/create-inventory.dto.interface";

export const updateInventory = async (
  client: AxiosInstance,
  id: number,
  dto: Partial<CreateInventoryDto>
) => {
  try {
    const { data } = await client.patch<
      Pick<Inventory, "id" | "name" | "publicId" | "createdAt" | "updatedAt">
    >(`/inventory/${id}`, dto);
    return data;
  } catch (error) {
    throw error;
  }
};
