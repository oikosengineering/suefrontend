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

  loginForm: FormGroup;
  hide = true;
  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService
    ) {

      this.loginForm = this.formBuilder.group({
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
    if (!this.loginForm.valid) {
      return false;
    }
    console.log(this.loginForm.value.user, this.loginForm.value.password);
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

}
