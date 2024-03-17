import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User, UserLogin, UserLoginRRSS} from "../interfaces/user";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {TokenResponse} from "../interfaces/responses";
import {SsrCookieService} from "ngx-cookie-service-ssr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #authUrl = 'auth';
  #router = inject(Router);
  #logged = signal(false);
  cookieService = inject(SsrCookieService);

  // Getter to check if the user is logged
  get logged() {
    return this.#logged.asReadonly();
  }

  // Method to login by email and password
  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, data).pipe
    (map(r => {
      this.cookieService.set("token", r.accessToken);
      this.#logged.set(true);
      return;
      }),
      catchError((error) => {
        console.error('Error en la solicitud de inicio de sesión: ', error);
        return throwError(error);
      })
    );
  }

  // Method to login by Google
  loginGoogle(data: UserLoginRRSS): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, data).pipe(
      map(r => {
        this.cookieService.set('token', r.accessToken);
        this.#logged.set(true);
        console.log('Usuario logueado con Google');
        return;
      }),
      catchError(error => {
        console.error('Error en la solicitud de inicio de sesión con Google: ', error);
        return throwError(error);
      })
    );
  }

  // Method to login by Facebook
  loginFacebook(data: UserLoginRRSS): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/facebook`, data).pipe(
      map(r => {
        this.cookieService.set('token', r.accessToken);
        this.#logged.set(true);
        console.log('Usuario logueado con Facebook');
        return;
      }),
      catchError(error => {
        console.error('Error en la solicitud de inicio de sesión con Facebook: ', error);
        return throwError(error);
      })
    );
  }

  // Method to register a new user
  register(data: User): Observable<void> {
    return this.#http.post<void>(`${this.#authUrl}/register`, data).pipe
    (map(() => {
        console.log('Usuario registrado');
      }),
      catchError(error => {
        console.error('Error en la solicitud de registro: ', error);
        return throwError(error);
      })
    );
  }

  // Method to logout
  logout(): void {
    this.cookieService.delete('token');
    this.#logged.set(false);

    this.#router.navigate(['/auth/login']).then(r => r);
  }

  // Auxiliary method to validate the token
  validateToken(): Observable<void> {
    return this.#http.get<void>(`${this.#authUrl}/validate`);
  }

  // Method to check if the user is logged
  isLogged(): Observable<boolean> {
    const token = this.cookieService.get('token');

    if (!this.logged() && !token) {
      return of(false);
    } else if (this.logged()) {
      return of(true);
    } else if (!this.logged() && token) {
      return this.validateToken().pipe(
        map(() => {
          this.#logged.set(true);
          return true;
        }),
        catchError(() => {
          this.cookieService.delete('token');
          this.#logged.set(false);
          return of(false);
        })
      );
    }

    return of(false);
  }

}
