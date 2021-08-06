import { AxiosInstance } from "axios";
import { Product } from "../../entities";
import { CreateProductDto } from "./interfaces/create-prodduct.dto.interface";

export const createProduct = async (
  client: AxiosInstance,
  inventoryId: string,
  dto: CreateProductDto
) => {
  try {
    const { data } = await client.post<Product>(
      `/inventory/${inventoryId}/product`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
