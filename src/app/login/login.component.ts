import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    private router: Router
    ) {

      this.loginForm = this.formBuilder.group({
        user: ['', Validators.compose(
          [
            Validators.required
          ]
        )],
        password: ['', Validators.compose(
          [
            Validators.required
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

}
