import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../core/services/validation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService
  ) { 
    this.signupForm = this.formBuilder.group({
      user: ['', Validators.compose(
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z]+$")
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

  submit() {
    if (!this.signupForm.valid) {
      return false;
    }
    console.log(this.signupForm.value.user, this.signupForm.value.password);
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

}
