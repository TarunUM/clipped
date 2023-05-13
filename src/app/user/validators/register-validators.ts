import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName:string , mactchingControlName:string) : ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(mactchingControlName);
      if (!control || !matchingControl) {
        console.error('Form Control can not be found in the forms group');
        return { controlNotFound: false };
      }
      const error =
        control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    };
  }
}
