import {Component, OnInit, inject, computed, WritableSignal, signal} from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import {animate, stagger, style, transition, trigger} from "@angular/animations";
import {query} from "@angular/animations";

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [
    FormsModule,
    ProductFormComponent,
    ProductCardComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
  animations: [
    trigger('animateList', [
      transition(':increment', [
        query('product-card:enter', [
          style({opacity: 0, transform: 'translateY(500px)'}),
          stagger(
    200,
            animate('1s ease-out', style({opacity: 1, transform: 'none'}))
          ),
        ]),
      ]),
    ]),
  ],
})

export class ProductsPageComponent implements OnInit {
  products: WritableSignal<Product[]> = signal([]);
  search = signal('');
  #productsService = inject(ProductsService);

  // Filter products using signals
  filteredProducts = computed(() =>
  this.products().filter((p) =>
    p.description.toLowerCase().includes(this.search().toLowerCase()) ||
    p.title.toLowerCase().includes(this.search().toLowerCase()))
  );

  // Getting the products from the service on init
  ngOnInit(): void {
    this.#productsService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (error) => console.error(error),
    });
  }

  // Method to delete a product
  deleteProduct(product: Product) {
    this.products.update((products) =>
      products.filter((p) => p.id !== product.id)
    );
  }

}
