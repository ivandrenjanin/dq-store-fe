import { AxiosInstance } from "axios";
import { CategoryResponse } from "./interfaces/category-response.interface";
import { CreateCategoryDto } from "./interfaces/create-category.dto.interface";

export const createCategory = async (
  client: AxiosInstance,
  inventoryId: number,
  dto: CreateCategoryDto
) => {
  try {
    const { data } = await client.post<CategoryResponse>(
      `/inventory/${inventoryId}/category`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
