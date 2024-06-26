import {Component, Inject, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {FormControl, ReactiveFormsModule, NonNullableFormBuilder, Validators} from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {MyGeolocation} from "../../geolocation";
import {isPlatformBrowser, NgClass} from "@angular/common";
import {UserLogin, UserLoginRRSS} from "../interfaces/user";
import {LoadGoogleApiService} from "../google-login/load-google-api.service";
import {Subscription} from "rxjs";
import {GoogleLoginDirective} from "../google-login/google-login.directive";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import {FbLoginDirective} from "../facebook-login/fb-login.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import Swal from "sweetalert2";

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, GoogleLoginDirective, RouterOutlet, FbLoginDirective, FaIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  #ngZone = inject(NgZone);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  #loadGoogle = inject(LoadGoogleApiService);
  iconFacebook = faFacebook;
  credentialsSub!: Subscription;
  position: { latitude: number; longitude: number } = {latitude: 0, longitude: 0};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  // Method OnInit to get the user's location
  async ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      try {
        this.position = await MyGeolocation.getLocation();
      } catch (error) {
        console.error("Error getting location: ", error);
        this.position = {latitude: 0, longitude: 0};
      }
    }

    // Subscribe to the logged signal
    this.credentialsSub = this.#loadGoogle.credential$.subscribe((response) => {
      // Log into the server with the Google token
      if (response.credential) {
        this.#authService
          .loginGoogle({token: response.credential, lat: this.position.latitude, lng: this.position.longitude})
          .subscribe(() => {
            Swal.fire({
              title: 'Success!',
              text: 'You have successfully logged in by Google.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(
              () => {
                this.#ngZone.run(() => {
                  this.#router.navigate(['/products']).then(r => r);
                });
              }
            );
          }, error => {
            Swal.fire({
              title: 'Error!',
              text: 'The email or password is incorrect.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then(() =>
              console.error(error)
            );
          });
      }
    });
  }

  // Method OnDestroy to unsubscribe
  ngOnDestroy() {
    this.credentialsSub.unsubscribe();
  }

  // Method to create the login form
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

  // Method to login by email and password
  login() {
    const user = {
      email: this.email.value,
      password: this.password.value,
      lat: this.position.latitude,
      lng: this.position.longitude
    }
    this.#authService
      .login(user as UserLogin)
      .subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          () => {
            this.#router.navigate(['/products']).then(r => r);
          }
        );
      }, error => {
        Swal.fire({
          title: 'Error!',
          text: 'The email or password is incorrect.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() =>
          console.error(error)
        );
      }
    );
  }

  // Method to login by Facebook
  loggedFacebook(response: fb.StatusResponse) {
    const user = {
      token: response.authResponse.accessToken,
      lat: this.position.latitude,
      lng: this.position.longitude
    }
    this.#authService
      .loginFacebook(user as UserLoginRRSS)
      .subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in by facebook.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          () => {
            this.#router.navigate(['/products']).then(r => r);
          }
        );
      }, error => {
        Swal.fire({
          title: 'Error!',
          text: 'Facebook login went wrong.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() =>
          console.error(error)
        );
      });
  }

  showError(error: any) {
    console.error(error);
  }


  // Method to go to the register page
  goRegister() {
    this.#router.navigate(['/auth/register']).then(r => r);
  }


}
