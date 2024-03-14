import {Product} from "./product";
import {User} from "../../auth/interfaces/user";

export interface RatingInsert {
  sellerRating: number;
  buyerRating: number;
  sellerComment: string;
  buyerComment: string;
  dateTransaction: string;
  product: number;
}

export interface Rating extends Omit<RatingInsert, "product"> {
  product: Product;
  user: User;
}
