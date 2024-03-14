import {Component, inject, OnInit} from '@angular/core';
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
import {NgClass} from "@angular/common";
import {MyGeolocation} from "../../geolocation";
import {AuthService} from "../services/auth.service";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {User} from "../interfaces/user";

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

  async ngOnInit() {
    try {
      this.position = await MyGeolocation.getLocation();
    } catch (error) {
      console.error("Error getting location: ", error);
      this.position = {latitude: 0, longitude: 0};
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
    this.#router.navigate(['/auth/login']);
  }

  validClasses(formControl: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    }
  }

  canDeactivate() {
    return (
      this.saved || this.registerForm.pristine ||
      confirm(
        '¿Quieres abandonar la página?. Se perderán los cambios no guardados.'
      )
    );
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
      console.log("Name - " + newUser.name, "email - " + newUser.email, "pass - " + newUser.password, "photo - " + newUser.photo, "lat - " + newUser.lat, "lng - " + newUser.lng)
      this.#authService.register(newUser as User)
        .subscribe(() => {
          this.saved = true;
          this.#router.navigate(['/auth/login']);
        });
    }
  }
}
