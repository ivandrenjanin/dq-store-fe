import { AxiosInstance } from "axios";
import { CreateInventoryDto } from "./interfaces/create-inventory.dto.interface";
import { InventoryResponse } from "./interfaces/inventory-response.interface";

export const updateInventory = async (
  client: AxiosInstance,
  id: number,
  dto: Partial<CreateInventoryDto>
) => {
  try {
    const { data } = await client.patch<InventoryResponse>(
      `/inventory/${id}`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
