import { UnitOfMessure } from "../../enum/unit-of-messure.enum";

export interface Category {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  code: string;
}

export interface Product {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  code: string;
  sellingPrice: number;
  quantity: number;
  unitOfMessure: UnitOfMessure;
  productCategories: {
    id: number;
    category: Category;
  }[];
}

export interface ProductOrder {
  id: number;
  total: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  total: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  productOrders: ProductOrder[];
}
export interface InventoryByIdResponse {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: String;
  categories: Category[];
  products: Product[];
  orders: Order[];
}
