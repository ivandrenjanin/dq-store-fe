import { AxiosInstance } from "axios";

export const getOrderInvoice = async (
  client: AxiosInstance,
  inventoryId: number,
  orderId: number
) => {
  try {
    const res = await client.get(
      `/inventory/${inventoryId}/order/${orderId}/invoice`
    );
    const linkSource = `data:application/pdf;base64,${res.data.file}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = res.data.fileName;
    downloadLink.click();
    downloadLink.remove();
  } catch (error) {
    throw error;
  }
};
