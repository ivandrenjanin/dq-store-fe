import { AxiosInstance } from "axios";

export const getOrderInvoice = async (
  client: AxiosInstance,
  inventoryId: string,
  orderId: string
) => {
  try {
    const res = await client.get(
      `/inventory/${inventoryId}/order/${orderId}/invoice`
    );
    // Generate File from Base64 response
    // const linkSource = `data:application/pdf;base64,${res.data.file}`;
    const downloadLink = document.createElement("a");
    // downloadLink.href = linkSource;
    downloadLink.href = res.data.filePath;
    downloadLink.download = res.data.fileName;
    downloadLink.target = "_blank";
    downloadLink.click();
    downloadLink.remove();
  } catch (error) {
    throw error;
  }
};
