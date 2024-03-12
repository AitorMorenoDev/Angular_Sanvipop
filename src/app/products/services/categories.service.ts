import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../interfaces/category';
import { CategoriesResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  #http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.#http
      .get<CategoriesResponse>('categories')
      .pipe(map((r) => r.categories));
  }
}
