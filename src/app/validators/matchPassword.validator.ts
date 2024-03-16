import {AbstractControl, ValidationErrors} from "@angular/forms";

export function matchPassword(
  c: AbstractControl
): ValidationErrors | null {
  const password = c.value.password;
  const confirmPassword = c.value.confirmPassword;
  return password === confirmPassword ? null : {matchPassword: true};
}
