import {Component, EventEmitter, Input, Output, inject, OnInit} from '@angular/core';
import { Product } from '../interfaces/product';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import { ProductsService } from '../services/products.service';
import { RouterLink } from '@angular/router';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faBookmark, faEye, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FontAwesomeModule, SweetAlert2Module, DatePipe, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() deleted = new EventEmitter<void>();
  #productsService = inject(ProductsService);
  #router = inject(Router);
  icons = {faTrash, faEye, faPencil, faBookmark}

  ngOnInit() {
    parseFloat(String(this.product.price)).toFixed(2);
  }

  deleteProduct() {
    Swal.fire({
      title: 'Delete product?',
      text: 'Are you sure you want to delete this product? You will not be able to recover this product!',
      icon: 'warning',
      confirmButtonText: 'Yes, delete it',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.#productsService.deleteProduct(this.product.id).subscribe(() => {
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success').then(() => {
            this.deleted.emit();
          });
        });
      }
    });
  }


  goEditPage() {
    this.#router.navigate(['products', this.product.id, 'edit']);
  }

  cancel() {
    this.#router.navigate(['products']);
  }

  bookmark() {
    this.#productsService
      .addFavoriteProduct(this.product.id)
      .subscribe(() => this.product.bookmarked = true);
  }

  unbookmark() {
    this.#productsService
      .removeFavoriteProduct(this.product.id)
      .subscribe(() => this.product.bookmarked = false);
  }

  getFavs() {
    console.log(this.#productsService.getFavoriteProducts());
  }
}
