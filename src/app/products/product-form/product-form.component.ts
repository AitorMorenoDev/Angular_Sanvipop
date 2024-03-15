import {Component, OnInit, inject} from '@angular/core';
import {
  FormControl, NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate';
import { positiveValueValidator } from '../../validators/positive-value.validator';
import { Category } from '../interfaces/category';
import {Product} from '../interfaces/product';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import {NgClass, NgIf} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})

export class ProductFormComponent implements OnInit, CanComponentDeactivate {
  categories: Category[] = [];

  saved = false;
  isEdit = false;
  productId = 0;

  #productsService = inject(ProductsService);
  #catsService = inject(CategoriesService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);

  title = this.#fb.control('', [Validators.required, Validators.minLength(5)]);
  description = this.#fb.control('', [Validators.required]);
  price = this.#fb.control(0, [Validators.required, positiveValueValidator]);
  category = this.#fb.control(0, [Validators.required, positiveValueValidator]);
  // If it's an edit, don't require the main photo
  mainPhoto = this.#fb.control('', this.isEdit ? []: [Validators.required]);

  productForm = this.#fb.group({
    title: this.title,
    description: this.description,
    price: this.price,
    category: this.category,
    mainPhoto: this.mainPhoto,
  });
  photoBase64 = '';

  ngOnInit(): void {
    this.#catsService
      .getCategories()
      .subscribe((cats) => (this.categories = cats));

    // Check if there is a product to edit or if it's a new product
    this.#route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = +params['id'];
        this.#productsService.getProduct(this.productId).subscribe((product) => {
          this.fillForm(product);
          this.productForm.markAsPristine(); // Mark the form as pristine to avoid touching every input in edit mode
        });
      }
    });
  }

  // ngBoostrap modal window to confirm if the user wants to leave the page
  canDeactivate() {
    if (this.saved || this.productForm.pristine) {
      return true;
    }

    return Swal.fire({
      title: 'Changes not saved will be discarded',
      text: 'Are you sure you want to leave this page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave the page.',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  // Add or remove classes based on form control state
  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  // Method to add or edit product depending on the isEdit property
  addOrEditProduct() {
    const productData = {
      title: this.title.value,
      description: this.description.value,
      price: this.price.value,
      category: this.category.value,
    }

    // If it's an edit, call the editProduct method, otherwise call the addProduct method (and pass the photoBase64 property)
    const productOperation = this.isEdit ?
      this.#productsService.editProduct(this.productId, productData) :
      this.#productsService.addProduct({ ...productData, mainPhoto: this.photoBase64 });

    productOperation.subscribe(() => {
      this.saved = true;

      Swal.fire({
        title: 'Success!',
        text: `The product has been ${this.isEdit ? 'edited' : 'added'}.`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() =>
        this.#router.navigate(['/products']).then(r => r));
    });
  }

  // If it's an edit, fill the form with the product data
  fillForm(product: Product) {
    this.productForm.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category.id,
      mainPhoto: product.mainPhoto
    });
  }

  // Method to get the base64 of the photo
  imageBase64(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.photoBase64 = '';
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);

    fileReader.addEventListener(
      'load',
      () => (this.photoBase64 = fileReader.result as string)
    );
  }
}
