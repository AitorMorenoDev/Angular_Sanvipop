import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product, ProductInsert } from '../interfaces/product';
import { ProductsResponse, SingleProductResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  #productsUrl = 'products';
  #http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(this.#productsUrl)
      .pipe(map((resp) => resp.products));
  }

  getProduct(id: number): Observable<Product> {
    return this.#http
    .get<SingleProductResponse>(`${this.#productsUrl}/${id}`)
    .pipe(map((resp) => resp.product));
  }

  addProduct(product: ProductInsert): Observable<Product> {
    product.category = +product.category;
    return this.#http
      .post<SingleProductResponse>(this.#productsUrl, product)
      .pipe(map((resp) => resp.product));
  }

  deleteProduct(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}`);
  }

}
