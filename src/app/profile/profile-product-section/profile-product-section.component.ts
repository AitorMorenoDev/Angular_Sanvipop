import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ProductCardComponent} from "../../products/product-card/product-card.component";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {Product} from "../../products/interfaces/product";

@Component({
  selector: 'profile-product-section',
  standalone: true,
  imports: [
    FaIconComponent,
    ProductCardComponent
  ],
  templateUrl: './profile-product-section.component.html',
  styleUrl: './profile-product-section.component.css'
})
export class ProfileProductSectionComponent {
  @Input() products!: Product[];
  @Input() title!: string;
  @Output() hide = new EventEmitter<void>();
  icons = {faEyeSlash};
}
