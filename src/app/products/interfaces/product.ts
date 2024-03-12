import { Category } from "./category";

export interface ProductInsert {
  title: string;
  description: string;
  category: number;
  price: number;
  mainPhoto: string;
}

export interface Product extends Omit<ProductInsert, "category"> {
  id: number;
  category: Category;
}
