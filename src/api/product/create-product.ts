import { AxiosInstance } from "axios";
import { CreateProductDto } from "./interfaces/create-prodduct.dto.interface";
import { ProductResponse } from "./interfaces/product-response.interface";

export const createProduct = async (
  client: AxiosInstance,
  inventoryId: number,
  dto: CreateProductDto
) => {
  try {
    const { data } = await client.post<ProductResponse>(
      `/inventory/${inventoryId}/product`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
