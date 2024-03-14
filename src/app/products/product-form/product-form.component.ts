import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate';
import { positiveValueValidator } from '../../validators/positive-value.validator';
import { Category } from '../interfaces/category';
import { ProductInsert } from '../interfaces/product';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})

export class ProductFormComponent implements OnInit, CanComponentDeactivate {
  categories: Category[] = [];

  saved = false;

  #productsService = inject(ProductsService);
  #catsService = inject(CategoriesService);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);

  title = this.#fb.control('', [Validators.required, Validators.minLength(5)]);
  description = this.#fb.control('', [Validators.required]);
  price = this.#fb.control(0, [Validators.required, positiveValueValidator]);
  category = this.#fb.control(0, [Validators.required, positiveValueValidator]);
  mainPhoto = this.#fb.control('', [Validators.required]);

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
  }

  canDeactivate() {
    return (
      this.saved ||
      this.productForm.pristine ||
      confirm(
        '¿Quieres abandonar la página?. Se perderán los cambios no guardados.'
      )
    );
  }

  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  addProduct() {
    const newProduct: ProductInsert = {
      ...this.productForm.getRawValue(),
      mainPhoto: this.photoBase64,
    };
    this.#productsService.addProduct(newProduct).subscribe(() => {
      this.saved = true;
      this.#router.navigate(['/products']);
    });
  }

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
