import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidationService } from '../core/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide = true;
  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService
    ) {

      

      this.form = this.formBuilder.group({
        user: ['', Validators.compose(
          [
            Validators.required
          ]
        )],
        password: ['', Validators.compose(
          [
            Validators.required,
            Validators.minLength(6)
          ]
        )]
      });
  }

  ngOnInit(): void {

  }

  logIn() {
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

}
