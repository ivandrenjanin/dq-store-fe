import { CompanyClient } from "./company-client.entity.interface";
import { ProductOrder } from "./product-order.entity.interface";

export interface Order {
  id: number;
  total: number;
  totalTaxed: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  productOrders: ProductOrder[];
  companyClient: CompanyClient;
}
