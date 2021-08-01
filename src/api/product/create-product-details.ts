import { AxiosInstance } from "axios";

export const createProductDetails = async (
  client: AxiosInstance,
  inventoryId: number,
  productId: number,
  quantity: number,
  primePrice: number
) => {
  try {
    await client.post(
      `/inventory/${inventoryId}/product/${productId}/details`,
      {
        primePrice,
        quantity,
      }
    );
  } catch (error) {
    throw error;
  }
};
