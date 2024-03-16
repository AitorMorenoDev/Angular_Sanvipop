import { Routes } from "@angular/router";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {profileResolver} from "./resolvers/profile.resolver";
import {ownProfileResolver} from "./resolvers/own-profile.resolver";


export const profileRoutes: Routes = [
  {
    path: '',
    resolve: {
      product: ownProfileResolver
    },
    component: ProfilePageComponent,
    title: 'My profile | Sanvipop',
  },
  {
    path: ':id',
    resolve: {
      product: profileResolver
    },
    component: ProfilePageComponent,
    title: 'Profile | Sanvipop',
  }
];
