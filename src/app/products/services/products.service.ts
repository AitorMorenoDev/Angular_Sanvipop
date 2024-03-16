import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {Product, ProductInsert, ProductUpdate} from '../interfaces/product';
import { ProductsResponse, SingleProductResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  #productsUrl = 'products';
  #http = inject(HttpClient);

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(this.#productsUrl)
      .pipe(map((resp) => resp.products));
  }

  // Get a single product
  getProduct(id: number): Observable<Product> {
    return this.#http
    .get<SingleProductResponse>(`${this.#productsUrl}/${id}`)
    .pipe(map((resp) => resp.product));
  }

  // Add a product
  addProduct(product: ProductInsert): Observable<Product> {
    product.category = +product.category;
    return this.#http
      .post<SingleProductResponse>(this.#productsUrl, product)
      .pipe(map((resp) => resp.product));
  }

  // Delete a product
  deleteProduct(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}`);
  }

  // Edit a product
  editProduct(id: number, product: ProductUpdate): Observable<Product> {
    product.category = +product.category;
    return this.#http
      .put<SingleProductResponse>(`${this.#productsUrl}/${id}`, product)
      .pipe(map((resp) => resp.product));
  }

  // Get favorite products
  getFavoriteProducts(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/bookmarks`)
      .pipe(map((resp) => resp.products));
  }

  // Add a product to favorites
  addFavoriteProduct(id: number): Observable<void> {
    return this.#http.post<void>(`${this.#productsUrl}/${id}/bookmarks`, {});
  }

  // Remove a product from favorites
  removeFavoriteProduct(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}/bookmarks`);
  }

  // Get products being sold by me
  getProductsSelling(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/mine`)
      .pipe(map((resp) => resp.products));
  }

  // Get products sold by me
  getProductsSold(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/mine/sold`)
      .pipe(map((resp) => resp.products));
  }

  // Get products bought by me
  getProductsBought(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/mine/bought`)
      .pipe(map((resp) => resp.products));
  }

  // Get products being sold by other user
  getProductsSellingUser(userId: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${userId}`)
      .pipe(map((resp: ProductsResponse) => resp.products));
  }

  // Get products sold by other user
  getProductsSoldByUser(userId: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${userId}/sold`)
      .pipe(map((resp) => resp.products));
  }

  // Get products bought by other user
  getProductsBoughtByUser(userId: number): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}/user/${userId}/bought`)
      .pipe(map((resp) => resp.products));
  }

  //Buy a product
  buyProduct(id: number): Observable<void> {
    return this.#http
      .put<void>(`${this.#productsUrl}/${id}/buy`, {});
  }



}
