import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../core/services/validation.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  form: FormGroup;

  constructor(
    private validationService: ValidationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      cognome: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      nome: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
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
      data_nascita: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      comune_nascita: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      provincia_nascita: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      via: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      civico: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      comune: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      provincia: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      cap: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      cellulare: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      telefono: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      fax: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      email: ['', Validators.compose(
        [
          Validators.required,
        ]
      )],
      pec: ['', Validators.compose(
        [
          Validators.required,
        ]
      )]
    });
  }

  submit(){
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      console.log(this.form.getRawValue());
    } else {
      this.validationService.validateAllFormFields(this.form);
      console.log(this.form.getRawValue());
    }
  }

  modifica(){

  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

}
