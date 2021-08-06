import { AxiosInstance } from "axios";
import { Category } from "../../entities";
import { CreateCategoryDto } from "./interfaces/create-category.dto.interface";

export const createCategory = async (
  client: AxiosInstance,
  inventoryId: string,
  dto: CreateCategoryDto
) => {
  try {
    const { data } = await client.post<Category>(
      `/inventory/${inventoryId}/category`,
      dto
    );
    return data;
  } catch (error) {
    throw error;
  }
};
