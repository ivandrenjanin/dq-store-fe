export interface CreateOrderInnerDto {
  productId: number;
  quantity: number;
}
export interface CreateOrderDto {
  order: CreateOrderInnerDto[];
}
