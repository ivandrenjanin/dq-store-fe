import { UnitOfMessure } from "../../enum/unit-of-messure.enum";

export interface ProductResponse {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  code: string;
  sellingPrice: number;
  quantity: number;
  unitOfMessure: UnitOfMessure;
}
