import { AxiosInstance } from "axios";
import { CreateOrderDto } from "./interfaces/create-order.dto";
export const createOrder = async (
  client: AxiosInstance,
  inventoryId: number,
  dto: CreateOrderDto
) => {
  try {
    await client.post(`/inventory/${inventoryId}/order`, dto);
  } catch (error) {
    throw error;
  }
};
