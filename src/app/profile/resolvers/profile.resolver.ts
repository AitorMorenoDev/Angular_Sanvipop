import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import {UserService} from "../services/user.service";
import {User} from "../../auth/interfaces/user";

export const profileResolver: ResolveFn<User> = (route) => {
  const router = inject(Router);
  return inject(UserService).getUser(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/profile']);
      return EMPTY;
    })
  );
}
