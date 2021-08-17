import { UnitOfMessure } from "../../../entities";

export interface CreateProductDto {
  name: string;
  sellingPrice: number;
  primePrice: number;
  taxRate: number;
  unitOfMessure: UnitOfMessure;
}
