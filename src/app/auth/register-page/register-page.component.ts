import {Component, inject} from '@angular/core';
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

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})

export class RegisterPageComponent implements CanComponentDeactivate {
  #router = inject(Router);
  saved: boolean = false;
  #fb = inject(NonNullableFormBuilder);

  name = this.#fb.control('', [Validators.required]);
  emailGroup = this.#fb.group({
     email: ['', [Validators.required, Validators.email]],
     confirmEmail: ['', [Validators.required, Validators.email]],
   }, {validators: matchEmail}),
  password = this.#fb.control('', [Validators.required, Validators.minLength(6)]);
  avatar = this.#fb.control('', [Validators.required]);

  registerForm = this.#fb.group({

  });

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
      this.saved ||
      this.registerForm.pristine ||
      confirm(
        '¿Quieres abandonar la página?. Se perderán los cambios no guardados.'
      )
    );
  }
}
