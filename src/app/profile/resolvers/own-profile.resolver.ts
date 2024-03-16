import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import {UserService} from "../services/user.service";
import {User} from "../../auth/interfaces/user";

export const ownProfileResolver: ResolveFn<User> = () => {
  const router = inject(Router);
  return inject(UserService).getOwnUser().pipe(
    catchError(() => {
      router.navigate(['/profile']);
      return EMPTY;
    })
  );
}
