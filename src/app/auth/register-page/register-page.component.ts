import {Component, Inject, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {CanComponentDeactivate} from "../../interfaces/can-component-deactivate";
import {matchEmail} from "../../validators/matchEmail.validator";
import {isPlatformBrowser, NgClass} from "@angular/common";
import {MyGeolocation} from "../../geolocation";
import {AuthService} from "../services/auth.service";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {User} from "../interfaces/user";
import Swal from "sweetalert2";

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SweetAlert2Module
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})

export class RegisterPageComponent implements CanComponentDeactivate, OnInit {
  #router = inject(Router);
  saved: boolean = false;
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);

  position: { latitude: number; longitude: number } = {latitude: 0, longitude: 0};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      try {
        this.position = await MyGeolocation.getLocation();
      } catch (error) {
        console.error("Error getting location: ", error);
        this.position = {latitude: 0, longitude: 0};
      }
    }
  }

  name = this.#fb.control('', [Validators.required]);
  emailGroup = this.#fb.group({
     email: ['', [Validators.required, Validators.email]],
     confirmEmail: ['', [Validators.required, Validators.email]],
   }, {validators: matchEmail});
  password = this.#fb.control('', [Validators.required, Validators.minLength(4)]);
  photo = this.#fb.control('', [Validators.required]);

  registerForm = this.#fb.group({
    name: this.name,
    emailGroup: this.emailGroup,
    password: this.password,
    photo: this.photo,
    lat: this.position.latitude,
    lng: this.position.longitude
  });
  avatarB64 = '';

  goLogin() {
    this.#router.navigate(['/auth/login']).then(r => r);
  }

  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  canDeactivate() {
    if (this.saved || this.registerForm.pristine) {
      return true;
    }

    return Swal.fire({
      title: 'Changes not saved will be discarded',
      text: 'Are you sure you want to leave this page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave the page.',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  imageBase64(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.avatarB64 = '';
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);

    fileReader.addEventListener(
      'load',
      () => (this.avatarB64 = fileReader.result as string)
    );
  }

  register() {
    if (this.registerForm.valid) {
      const newUser = {
        name: this.name.value,
        email: this.emailGroup.controls.email.value,
        password: this.password.value,
        photo: this.avatarB64,
        lat: this.position.latitude,
        lng: this.position.longitude
      }
      this.#authService.register(newUser as User)
        .subscribe(() => {
            Swal.fire({
              title: 'Success!',
              text: 'You have successfully registered.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(
              () => {
                this.saved = true;
                this.#router.navigate(['/auth/login']).then(r => r);
              }
            );
          }, error => {
            Swal.fire({
              title: 'Error!',
              text: 'The register has failed.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then(() =>
              console.error(error)
            );
          }
        );
    }
  }
}
