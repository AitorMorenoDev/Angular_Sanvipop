import { Routes } from "@angular/router";
import { ProductsPageComponent } from "./products-page/products-page.component";
import { ProductFormComponent } from "./product-form/product-form.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { productResolver } from "./resolvers/product.resolver";
import { numericIdGuard } from "../guards/numeric-id.guard";
import { leavePageGuard } from "../guards/leave-page.guard";

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsPageComponent,
    title: 'Products | Sanvipop',
  },
  {
    path: 'add',
    canDeactivate: [leavePageGuard],
    component: ProductFormComponent,
    title: 'Add new product | Sanvipop',
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    resolve: {
      product: productResolver
    },
    component: ProductDetailComponent,
    title: 'Product detail | Sanvipop',
  },
  {
    path: ':id/edit',
    canActivate: [numericIdGuard],
    canDeactivate: [leavePageGuard],
    resolve: {
      product: productResolver
    },
    component: ProductFormComponent,
    title: 'Edit product | Sanvipop',
  },
];
