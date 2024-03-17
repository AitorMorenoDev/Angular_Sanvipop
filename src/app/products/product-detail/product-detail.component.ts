import {Component, inject, Input, OnInit} from '@angular/core';
import {Product} from '../interfaces/product';
import {Router} from '@angular/router';
import {ProductCardComponent} from '../product-card/product-card.component';
import {ProductsService} from "../services/products.service";
import {faCartPlus, faImage} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import Swal from "sweetalert2";
import {BmAutosuggestDirective} from "../../profile/bingmaps/bm-autosuggest.directive";
import {BmMapDirective} from "../../profile/bingmaps/bm-map.directive";
import {BmMarkerDirective} from "../../profile/bingmaps/bm-maker.directive";
import {Coordinates} from "../../profile/bingmaps/coordinates";
import {StripeCardGroupDirective, StripeElementsDirective} from "ngx-stripe";

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, FaIconComponent, BmAutosuggestDirective, BmMapDirective, BmMarkerDirective, StripeCardGroupDirective, StripeElementsDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  @Input() product!: Product;

  #router = inject(Router);
  #productService = inject(ProductsService);
  icons = {faCartPlus, faImage};
  // Server route to use it to get the buyer photo (the server returns a relative route)
  serverRoute = "https://api.fullstackpro.es/sanvipop/";
  photoToAdd: string = '';

  coordinates: Coordinates = {latitude: 0, longitude: 0};

  ngOnInit() {
    this.coordinates = {
      latitude: this.product.owner.lat,
      longitude: this.product.owner.lng
    }
  }
  goBack() {
    this.#router.navigate(['/products']).then(r => r);
  }

  buyProduct() {
    this.#productService.buyProduct(this.product.id).subscribe(() => {
      this.product.status = 3;
      Swal.fire({
        title: 'Producto comprado',
        text: 'El producto ha sido comprado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
        // Method to equal the product with the updated product, so the view shows the buyer
        .then(() => {
          this.#productService.getProduct(this.product.id).subscribe((productUpdate) =>{
            this.product = productUpdate;
          })
        });
    });
  }

  addPhoto(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);

    fileReader.addEventListener(
      'load',
      () => {
        this.photoToAdd = fileReader.result as string;

        this.#productService.addPhotos(this.product.id, this.photoToAdd).subscribe(() => {
          Swal.fire({
            title: 'Success!',
            text: 'You have successfully updated your photo.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(
            () => {
              this.#productService.getProduct(this.product.id).subscribe(r => {
                this.product = r;
              });
            }
          );
        })
      }
    );
  }
}
