import { AxiosInstance } from "axios";
import { CreateProductDto } from "./interfaces/create-prodduct.dto.interface";

export const updateProduct = async (
  client: AxiosInstance,
  inventoryId: string,
  productId: string,
  dto: Partial<CreateProductDto>
) => {
  try {
    await client.patch(`/inventory/${inventoryId}/product/${productId}`, dto);
  } catch (error) {
    throw error;
  }
};
