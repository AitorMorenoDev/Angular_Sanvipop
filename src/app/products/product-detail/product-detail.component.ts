import {Component, Input, inject, OnInit} from '@angular/core';
import { Product } from '../interfaces/product';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import {ProductsService} from "../services/products.service";
import {faCartPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import Swal from "sweetalert2";
import {BmAutosuggestDirective} from "../../profile/bingmaps/bm-autosuggest.directive";
import {BmMapDirective} from "../../profile/bingmaps/bm-map.directive";
import {BmMarkerDirective} from "../../profile/bingmaps/bm-maker.directive";
import {Coordinates} from "../../profile/bingmaps/coordinates";

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [ProductCardComponent, FaIconComponent, BmAutosuggestDirective, BmMapDirective, BmMarkerDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  @Input() product!: Product;

  #router = inject(Router);
  #productService = inject(ProductsService);
  icons = {faCartPlus};
  // Server route to use it to get the buyer photo (the server returns a relative route)
  serverRoute = "http://api.fullstackpro.es/sanvipop/";

  coordinates: Coordinates = {latitude: 0, longitude: 0};

  ngOnInit() {
    this.coordinates = {
      latitude: this.product.owner.lat,
      longitude: this.product.owner.lng
    }
  }
  goBack() {
    this.#router.navigate(['/products']);
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
}
