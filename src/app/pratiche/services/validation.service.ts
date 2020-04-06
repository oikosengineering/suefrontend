import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let validation_messages = {
      'required': 'Il campo è obbligatorio',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'phoneVali': 'Check your phone number',
      'checkPinNumber': 'Check your pin number'
    };
    return validation_messages[validatorName];
  }

  getErrorMessage(control: AbstractControl){
    for (let propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName) && control.touched) {
        return this.getValidatorErrorMessage(propertyName, control.errors[propertyName]);
      }
    }
    return null;
  }
}
