import { AxiosInstance } from "axios";

export const createProductDetails = async (
  client: AxiosInstance,
  inventoryId: number,
  productId: number,
  quantity: number
) => {
  try {
    await client.post(
      `/inventory/${inventoryId}/product/${productId}/details`,
      {
        primePrice: 10,
        quantity,
      }
    );
  } catch (error) {
    throw error;
  }
};
