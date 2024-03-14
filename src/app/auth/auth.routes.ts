import { Routes } from "@angular/router";
import { LoginPageComponent } from "./login-page/login-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {leavePageGuard} from "../guards/leave-page.guard";

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    canDeactivate: [leavePageGuard],
    component: RegisterPageComponent
  },
];
