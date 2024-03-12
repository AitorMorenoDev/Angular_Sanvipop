import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() deleted = new EventEmitter<void>();

  #productsService = inject(ProductsService);

  deleteProduct() {
    this.#productsService
      .deleteProduct(this.product.id)
      .subscribe(() => this.deleted.emit());
  }
}
