import { Category } from "./category";
import { Product } from "./product";
import {Rating} from "./rating";

export interface CategoriesResponse {
  categories: Category[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface SingleProductResponse {
  product: Product;
}

export interface PhotoResponse {
  photo: string;
}

export interface RatingResponse {
  comment: Rating[]
}
