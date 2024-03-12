import { FormControl, ValidationErrors } from "@angular/forms";

export function positiveValueValidator(control: FormControl): ValidationErrors | null {
  const value = +control.value;
    if(control.value !== null && !isNaN(value) && value <= 0) {
      return  {'positiveValue': true}
    }
    return null;
}
