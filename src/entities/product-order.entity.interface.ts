import { Product } from "./product.entity.interface";

export interface ProductOrder {
  id: number;
  total: number;
  quantity: number;
  product: Product;
}
