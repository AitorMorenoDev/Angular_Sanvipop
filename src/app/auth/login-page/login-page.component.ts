import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, NonNullableFormBuilder, Validators} from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {MyGeolocation} from "../../geolocation";
import {NgClass} from "@angular/common";
import {UserLogin} from "../interfaces/user";
import {LoadGoogleApiService} from "../google-login/load-google-api.service";
import {Subscription} from "rxjs";
import {GoogleLoginDirective} from "../google-login/google-login.directive";
import {faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FbLoginDirective} from "../facebook-login/fb-login.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, GoogleLoginDirective, RouterOutlet, FbLoginDirective, FaIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  #loadGoogle = inject(LoadGoogleApiService);
  iconGoogle = faGoogle;
  iconFacebook = faFacebook;
  credentialsSub!: Subscription;
  position: { latitude: number; longitude: number } = {latitude: 0, longitude: 0};

  async ngOnInit() {
    try {
      this.position = await MyGeolocation.getLocation();
    } catch (error) {
      console.error("Error getting location: ", error);
      this.position = {latitude: 0, longitude: 0};
    }
  }

  ngOnDestroy() {
    this.credentialsSub.unsubscribe();
  }

  loggedFacebook(response: fb.StatusResponse) {
    console.log("Facebook response: ", response.authResponse.accessToken);
    this.#router.navigate(['/products']).then(r => r);
  }

  showError(error: any) {
    console.error(error);
  }

  email = this.#fb.control('', [Validators.required]);
  password = this.#fb.control('', [Validators.required]);

  loginForm = this.#fb.group({
    email: this.email,
    password: this.password
  });

  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  login() {
    const user = {
      email: this.email.value,
      password: this.password.value,
      lat: this.position.latitude,
      lng: this.position.longitude
    }
    console.log("email - " + user.email + " password - " + user.password + " lat - " + user.lat + " lng - " + user.lng)
    this.#authService.login(user as UserLogin)
      .subscribe(() => {
        this.#router.navigate(['/products']).then(r => r);
      });
  }

  loginGoogle() {
    this.credentialsSub = this.#loadGoogle.credential$.subscribe((response) => {
      if (response.credential) {
        console.log("Google response: ", response);
        this.#router.navigate(['/products']).then(r => r);
      }
    });
  }

  loginFacebook() {

  }

  goRegister() {
    this.#router.navigate(['/auth/register']);
  }


}
