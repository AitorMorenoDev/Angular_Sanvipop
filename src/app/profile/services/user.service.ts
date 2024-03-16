import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../auth/interfaces/user";
import {map, Observable} from "rxjs";
import {UsersResponse, UserResponse} from "../../auth/interfaces/responses";
import {UserPassWordEdit, UserProfileEdit} from "../interfaces/userEdit";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #usersUrl = 'users';
  #http = inject(HttpClient);

  getUser(id: number): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#usersUrl}/${id}`)
      .pipe(map((resp) => resp.user));
  }

  getOwnUser(): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#usersUrl}/me`)
      .pipe(map((resp) => resp.user));
  }


  editUser(name: string, email: string): Observable<UserProfileEdit> {
    return this.#http
      .put<UserProfileEdit>(`${this.#usersUrl}/me`, {name, email});
  }

  editPassword(password: string): Observable<UserPassWordEdit> {
    return this.#http
      .put<UserPassWordEdit>(`${this.#usersUrl}/me/password`, {password});
  }

  editPhoto(photo: string): Observable<User> {
    return this.#http
      .put<UserResponse>(`${this.#usersUrl}/me/photo`, {photo})
      .pipe(map((resp) => resp.user));
  }
}
