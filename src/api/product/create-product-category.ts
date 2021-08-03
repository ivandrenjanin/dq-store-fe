import { AxiosInstance } from "axios";

export const createProductCategory = async (
  client: AxiosInstance,
  inventoryId: string,
  productId: string,
  categoryId: number
) => {
  try {
    await client.post(
      `/inventory/${inventoryId}/product/${productId}/category`,
      {
        categoryId,
      }
    );
  } catch (error) {
    throw error;
  }
};
