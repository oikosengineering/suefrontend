import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let validation_messages = {
      'required': 'Il campo è obbligatorio.',
      'minlength': `Lunghezza minima ${validatorValue.requiredLength} caratteri.`,
      'maxlength': `Lunghezza massima ${validatorValue.requiredLength} caratteri.`,
      'pattern': `Valore non valido`,
      'atLeastOnecfpiva': "Uno dei due campi 'Codice fiscale' o 'Partita IVA' deve essere compilato.",
      'mismatchPsw': "Le password non sono uguali.",
      'min': `Il valore minimo è ${validatorValue.min}`,
      'atLeastOnetelcel': "Uno dei due campi 'Telefono' o 'Cellulare' deve essere compilato."
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

  validateAllFormFields(formGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      if(formGroup.get(field).controls){
        this.validateAllFormFields(<FormGroup>formGroup.controls[field]);
      } else {
        const control = formGroup.get(field);
        control.markAsTouched({ onlySelf: true });
      }
      
    });
  }
}

export const atLeastOnecfpiva = (validator: ValidatorFn, controls:string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if(!controls){
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOnecfpiva: true,
  };
};

export const atLeastOne = (validator: ValidatorFn, controls:string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if(!controls){
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

export const passwordMatch = (control: string) => (self: AbstractControl) =>{
  return self.parent.controls[control].value === self.value ? null : {'mismatchPsw': true};
}
