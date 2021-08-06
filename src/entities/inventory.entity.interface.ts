import { Category } from "./category.entity.interface";
import { Order } from "./order.entity.interface";
import { Product } from "./product.entity.interface";

export interface Inventory {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: String;
  categories: Category[];
  products: Product[];
  orders: Order[];
}
