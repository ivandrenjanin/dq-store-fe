import { UnitOfMessure } from "./enum/unit-of-messure.enum";
import { ProductCategory } from "./product-category.entity.interface";

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
  primePrice: number;
  taxRate: number;
  taxedPrice: number;
  productCategories: ProductCategory[];
}
