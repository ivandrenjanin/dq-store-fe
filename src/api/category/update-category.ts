import { AxiosInstance } from "axios";

import { Category } from "../../entities";
import { CreateCategoryDto } from "./interfaces/create-category.dto.interface";

export const updateCategory = async (
  client: AxiosInstance,
  inventoryId: string,
  categoryId: string,
  dto: CreateCategoryDto
) => {
  try {
    const { data } = await client.patch<Category>(
      `/inventory/${inventoryId}/category/${categoryId}`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
