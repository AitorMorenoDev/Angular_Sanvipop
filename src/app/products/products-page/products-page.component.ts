import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductFilterPipe } from '../pipes/product-filter.pipe';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [
    FormsModule,
    ProductFormComponent,
    ProductCardComponent,
    ProductFilterPipe,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  search = '';

  #productsService = inject(ProductsService);

  ngOnInit(): void {
    this.#productsService.getProducts().subscribe(p => this.products = p);
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter((p) => p !== product);
  }
}
