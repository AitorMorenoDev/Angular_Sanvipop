import { Component, Input, inject } from '@angular/core';
import { Product } from '../interfaces/product';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import {ProductsService} from "../services/products.service";
import {faCartPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, FaIconComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product!: Product;

  #router = inject(Router);
  #productService = inject(ProductsService);
  icons = {faCartPlus};

  goBack() {
    this.#router.navigate(['/products']);
  }

  buyProduct() {
    console.log(this.product.id)
    console.log(this.product.status)
    this.#productService.buyProduct(this.product.id).subscribe(() => {
      this.product.status = 3;
    });
  }

  protected readonly faCartPlus = faCartPlus;
}
