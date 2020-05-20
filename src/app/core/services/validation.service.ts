import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import CodiceFiscale  from 'codice-fiscale-js';

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
      'atLeastOnetelcel': "Uno dei due campi 'Telefono' o 'Cellulare' deve essere compilato.",
      'fiscalCode': "Il codice fiscale non combacia con i dati inseriti"
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

export function fiscalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined && (isNaN(control.value))){
      let form = control.parent;
      if(form.get('first_name').value && form.get('last_name').value
      && form.get('birthday').value && form.get('birthplace').value
      && form.get('gender').value && form.get('county_of_birth').value){
        let dati = {
          name: form.get('first_name').value,
          surname: form.get('last_name').value,
          gender: form.get('gender').value,
          day: new Date(form.get('birthday').value).getDate() || new Date().getDate(),
          month: new Date(form.get('birthday').value).getMonth() + 1 || new Date().getMonth() + 1,
          year: new Date(form.get('birthday').value).getFullYear() || new Date().getFullYear(),
          birthplace: form.get('birthplace').value, 
          birthplaceProvincia: form.get('county_of_birth').value
        }
        const cf = new CodiceFiscale(dati);
        if (control.value != cf.code) {
            return { 'fiscalCode': true };
        }
      }
      return null;
    } else {
      return null;
    }
  };
}
