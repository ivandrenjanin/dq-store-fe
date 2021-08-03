import { UnitOfMessure } from "../../enum/unit-of-messure.enum";

export interface ProductResponse {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  code: string;
  sellingPrice: number;
  primePrice: number;
  taxRate: number;
  taxedPrice: number;
  quantity: number;
  unitOfMessure: UnitOfMessure;
}
