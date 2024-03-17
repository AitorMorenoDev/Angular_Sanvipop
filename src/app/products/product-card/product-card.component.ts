import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Product} from '../interfaces/product';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import {ProductsService} from '../services/products.service';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faBookmark, faEye, faPencil, faStar, faTrash} from "@fortawesome/free-solid-svg-icons";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import {NgbCarousel, NgbCarouselModule, NgbNavItem, NgbSlide} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FontAwesomeModule, SweetAlert2Module, DatePipe, DecimalPipe, NgbCarousel, NgbSlide, NgbCarouselModule, NgbNavItem],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() deleted = new EventEmitter<void>();
  #productsService = inject(ProductsService);
  icons = {faTrash, faEye, faPencil, faBookmark, faStar}

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

  deletePhoto(idPhoto: number) {
    this.#productsService
      .deletePhoto(this.product.id, idPhoto)
      .subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Photo deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.product.photos = this.product.photos.filter(photo => photo.id !== idPhoto);
        });
      });
  }

  mainPhoto(id: number, idPhoto: number) {
    this.#productsService.mainPhoto(id, idPhoto).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'You have successfully updated your photo.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(
        () => {
          this.#productsService.getProduct(this.product.id).subscribe(r => {
            this.product = r;
          });
        }
      );
    });
  }
}
