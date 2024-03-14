import { Category } from "./category";
import {User} from "../../auth/interfaces/user";
import {Photo} from "./photo";
import {Rating} from "./rating";

type Status = 1 | 2 | 3;

export interface ProductInsert {
  title: string;
  description: string;
  category: number;
  price: number;
  mainPhoto: string;
}

export interface Product extends Omit<ProductInsert, "category"> {
  id: number;
  datePublished: string;
  status: Status;
  owner: User;
  numVisits: number;
  category: Category;
  soldTo: User;
  rating: Rating[];
  photos: Photo[];
  bookmarked: boolean;
  distance: number;
  mine: boolean;
}
