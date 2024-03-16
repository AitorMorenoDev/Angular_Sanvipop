import {Component, inject, Input, numberAttribute, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../../auth/interfaces/user";
import {
  faBookmark,
  faCoins,
  faEuroSign, faEyeSlash,
  faHandHoldingUsd,
  faImage,
  faLock,
  faPencil
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Coordinates} from "../bingmaps/coordinates";
import {BmMapDirective} from "../bingmaps/bm-map.directive";
import {BmMarkerDirective} from "../bingmaps/bm-maker.directive";
import {BmAutosuggestDirective} from "../bingmaps/bm-autosuggest.directive";
import Swal from "sweetalert2";
import {FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {matchPassword} from "../../validators/matchPassword.validator";
import {ProductCardComponent} from "../../products/product-card/product-card.component";
import {Product} from "../../products/interfaces/product";
import {ProductsService} from "../../products/services/products.service";
import {Observable} from "rxjs";
import {ProfileProductSectionComponent} from "../profile-product-section/profile-product-section.component";

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [
    FaIconComponent, BmMapDirective, BmMarkerDirective, BmAutosuggestDirective, FormsModule, ReactiveFormsModule, NgClass, ProductCardComponent, ProfileProductSectionComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {

  #userService = inject(UserService);
  #productsService = inject(ProductsService);
  @Input({transform: numberAttribute }) id!: number;
  user!: User;
  icons = {faPencil, faImage, faLock, faBookmark, faCoins, faEuroSign, faHandHoldingUsd, faEyeSlash};
  coordinates: Coordinates = {latitude: 0, longitude: 0};
  avatarB64: string = '';
  #fb = inject(NonNullableFormBuilder);

  // Booleans to show/hide the different forms
  editingProfile = false;
  editingPassword = false;

  // Products to be shown in the different sections
  product!: Product;
  productsSellingUser: Product[] = [];
  productsSoldUser: Product[] = [];
  productsBoughtUser: Product[] = [];
  productsFav: Product[] = [];

  // Booleans to show/hide the different sections
  sellingBool = false;
  soldBool = false;
  boughtBool = false;
  favBool = false;

  // Form controls
  name = this.#fb.control('', [Validators.required]);
  email = this.#fb.control('', [Validators.required, Validators.email]);
  password = this.#fb.control('', [Validators.required, Validators.minLength(4)]);
  confirmPassword = this.#fb.control('', [Validators.required, Validators.minLength(4)]);

  editProfileForm = this.#fb.group({
    name: this.name,
    email: this.email
  });

  editPasswordForm = this.#fb.group({
    password: this.password,
    confirmPassword: this.confirmPassword
  }, {validators: matchPassword});

  // Valid classes for the form controls
  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  // Get the user on init
  ngOnInit() {
    if(this.id) {
      this.#userService
        .getUser(this.id)
        .subscribe(user => {
          this.user = user
          this.coordinates = {latitude: this.user.lat, longitude: this.user.lng};
        });
    } else {
      this.#userService
        .getOwnUser()
        .subscribe(user => {
          this.user = user
          this.coordinates = {latitude: this.user.lat, longitude: this.user.lng};
          }
        );
    }
  }

  // Method to edit the name and the email
  editProfile(){
    if(this.editProfileForm.valid) {
        const name = this.editProfileForm.value.name;
        const email = this.editProfileForm.value.email;

      this.#userService.editUser(name!, email!).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully updated your profile.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          () => {
            this.#userService.getOwnUser().subscribe(r => {
              this.user.name = r.name;
              this.user.email = r.email;
              this.editingProfile = false;
            });
          }
        );
      });
    }
  }

  // Method to edit the password
  editPassword() {
    if (this.editPasswordForm.valid) {
      const password = this.editPasswordForm.value.password;

      this.#userService.editPassword(password!).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully updated your password.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          () => {
            this.#userService.getOwnUser().subscribe(r => {
              this.user.password = r.password;
              this.editingPassword = false;
            });
          }
        );
      });
    }
  }

  // Method to edit the photo
  editPhoto(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);

    fileReader.addEventListener(
      'load',
      () => {
        this.avatarB64 = fileReader.result as string

        this.#userService.editPhoto(this.avatarB64).subscribe(r => {
          Swal.fire({
            title: 'Success!',
            text: 'You have successfully updated your photo.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(
            () => {
              this.#userService.getOwnUser().subscribe(r => {
                this.user.photo = r.photo;
              });
            }
          );
        })
      }
    );
  }

  // Method to get the products depending on the section
  fetchProducts(type: string) {
    let fetchMethod: Observable<Product[]> | undefined;
    let productsArray: keyof ProfilePageComponent | undefined;

    switch (type) {
      case 'selling':
        this.sellingBool = true;
        fetchMethod = this.id ? this.#productsService.getProductsSellingUser(this.user.id!) : this.#productsService.getProductsSelling();
        productsArray = 'productsSellingUser';
        break;
      case 'sold':
        this.soldBool = true;
        fetchMethod = this.id ? this.#productsService.getProductsSoldByUser(this.user.id!) : this.#productsService.getProductsSold();
        productsArray = 'productsSoldUser';
        break;
      case 'bought':
        this.boughtBool = true;
        fetchMethod = this.id ? this.#productsService.getProductsBoughtByUser(this.user.id!) : this.#productsService.getProductsBought();
        productsArray = 'productsBoughtUser';
        break;
      case 'favs':
        this.favBool = true;
        fetchMethod = this.#productsService.getFavoriteProducts();
        productsArray = 'productsFav';
        break;
    }

    fetchMethod?.subscribe(products => {
      if (productsArray && productsArray in this) {
        (this[productsArray as keyof ProfilePageComponent] as Product[]) = products;
      }
    });
  }
}
