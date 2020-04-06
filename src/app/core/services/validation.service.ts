import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let validation_messages = {
      'required': 'Il campo è obbligatorio.',
      'minlength': `Lunghezza minima ${validatorValue.requiredLength} caratteri, lunghezza attuale ${validatorValue.actualLength} caratteri.`,
      'maxlength': `Lunghezza massima ${validatorValue.requiredLength} caratteri.`,
      'pattern': `Deve contenere solo i seguenti caratteri ${validatorValue.requiredPattern} caratteri.`,
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
