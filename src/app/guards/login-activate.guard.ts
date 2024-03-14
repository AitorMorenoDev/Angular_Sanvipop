import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../auth/services/auth.service";
import {map} from "rxjs";
import {inject} from "@angular/core";

export const loginActivateGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService();
  const router = inject(Router);

  return authService.isLogged().pipe(
    map(isLogged => {
      if (!isLogged) {
        return router.createUrlTree(['/auth/login']);
      } else {
        return true;
      }
    })
  )
};
