export interface CreateOrderInnerDto {
  productId: number;
  quantity: number;
}
export interface CreateOrderDto {
  companyClientId: number;
  order: CreateOrderInnerDto[];
}
