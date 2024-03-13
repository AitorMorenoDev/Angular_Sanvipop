import {AbstractControl, ValidationErrors} from "@angular/forms";

export function matchEmail(
  c: AbstractControl
): ValidationErrors | null {
  const email = c.value.email;
  const confirmEmail = c.value.confirmEmail;
  return email === confirmEmail ? null : {matchEmail: true};
}
