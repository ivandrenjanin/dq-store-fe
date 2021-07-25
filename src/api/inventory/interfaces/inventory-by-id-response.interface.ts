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
  productCategories: {
    id: number;
    category: Category;
  }[];
}

export interface InventoryByIdResponse {
  id: number;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  name: String;
  categories: Category[];
  products: Product[];
}
