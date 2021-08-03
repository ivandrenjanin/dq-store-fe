export interface CreateProductDto {
  name: string;
  code: string;
  sellingPrice: number;
  primePrice: number;
  taxRate: number;
}
