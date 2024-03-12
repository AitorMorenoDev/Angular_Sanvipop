import { Category } from "./category";
import { Product } from "./product";

export interface CategoriesResponse {
  categories: Category[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface SingleProductResponse {
  product: Product;
}
