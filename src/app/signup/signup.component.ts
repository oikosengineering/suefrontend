import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService, atLeastOnecfpiva, passwordMatch } from '../core/services/validation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  hide = true;
  hide2 = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService
  ) { 
    
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      codicefiscale: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      partitaiva: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      email: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      password: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      password2: ['', Validators.compose(
        [
          Validators.required
        ]
      )],
    }, { validator: atLeastOnecfpiva(Validators.required, ['codicefiscale','partitaiva'])});
    this.form.get('password2').setValidators(passwordMatch('password'));
    this.form.get('password2').updateValueAndValidity();
  }

  submit() {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      console.log(this.form.getRawValue());
    } else {
      this.validationService.validateAllFormFields(this.form);
      console.log(this.form.getRawValue());
    }
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

  check(field: string, target: string, value: any){
    if(this.form.get(target).value === value){
      this.form.get(field).setValidators(this.addValidators(field));
      this.form.get(field).updateValueAndValidity();
      return true;
    } else {
      this.form.get(field).clearValidators();
      this.form.get(field).setValidators(this.safeValidators(field));
      this.form.get(field).updateValueAndValidity();
      return false;
    }
    
  }

  addValidators(value: string){
    switch(value){
      case 'codicefiscale':
        return [Validators.required, Validators.pattern("/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i")];
      case 'partitaiva':
        return [Validators.required, Validators.maxLength(11), Validators.minLength(11)];
    }
  }

  safeValidators(value: string){
    switch(value){
      case 'codicefiscale':
        return [Validators.pattern("/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i")];
      case 'partitaiva':
        console.log('entrato');
        return [Validators.maxLength(11), Validators.minLength(11)];
    }
  }

}
