import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { EMPTY, catchError } from 'rxjs';
import { Product } from '../interfaces/product';

export const productResolver: ResolveFn<Product> = (route) => {
  const router = inject(Router);
  return inject(ProductsService).getProduct(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/posts']);
      return EMPTY;
    })
  );
}
