import { AxiosInstance } from "axios";

import { Inventory } from "../../entities";

export const getInventories = async (client: AxiosInstance) => {
  try {
    const { data } = await client.get<
      Pick<Inventory, "id" | "name" | "publicId" | "createdAt" | "updatedAt">[]
    >("/inventory");
    return data;
  } catch (error) {
    throw error;
  }
};
