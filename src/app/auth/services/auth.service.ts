import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User, UserLogin} from "../interfaces/user";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {TokenResponse} from "../interfaces/responses";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  #http = inject(HttpClient);
  #authUrl = 'auth';
  #router = inject(Router);
  #logged = signal(false);

  get logged() {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, data).pipe
    (map(r => {
      localStorage.setItem("token", r.accessToken);
      this.#logged.set(true);
      console.log('Usuario logueado');
      console.log('token: ', r.accessToken);
      return;
      }),
      catchError((error) => {
        console.error('Error en la solicitud de inicio de sesión: ', error);
        return throwError(error);
      })
    );
  }

  loginGoogle(token: string): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, {token}).pipe(
      map(r => {
        localStorage.setItem('token', r.accessToken);
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

  loginFacebook(token: string): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/facebook`, {token}).pipe(
      map(r => {
        localStorage.setItem('token', r.accessToken);
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

  logout(): void {
    localStorage.removeItem('token');
    this.#logged.set(false);
    this.#router.navigate(['/auth/login']).then(r => r);
  }

  validateToken(): Observable<void> {
    return this.#http.get<void>(`${this.#authUrl}/validate`);
  }

  isLogged(): Observable<boolean> {
    const token = localStorage.getItem('token');

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
          localStorage.removeItem('token');
          this.#logged.set(false);
          return of(false);
        })
      );
    }

    return of(false);
  }

}
