import { AxiosInstance } from "axios";

export const createProductCategory = async (
  client: AxiosInstance,
  inventoryId: number,
  productId: number,
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
