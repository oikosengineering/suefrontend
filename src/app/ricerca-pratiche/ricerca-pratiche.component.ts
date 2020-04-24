import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ValidationService } from '../core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-ricerca-pratiche',
  templateUrl: './ricerca-pratiche.component.html',
  styleUrls: ['./ricerca-pratiche.component.scss']
})
export class RicercaPraticheComponent implements OnInit {
  form: FormGroup;
  isUserLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dialog: DialogMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }


  createForm() {
    this.form = this.fb.group({
      referente: this.fb.group({
        titolare: new FormControl(''),
        indirizzo: new FormControl(''),
        comune: new FormControl(null, Validators.compose([Validators.required])),
        civico: new FormControl('')
      }),
      dati_pratica: this.fb.group({
        inizio: new FormControl(''),
        fine: new FormControl(''),
        danumero: new FormControl(''),
        anumero: new FormControl(''),
        foglio_catasto: new FormControl(''),
        numero_catasto: new FormControl(''),
        sezione_catasto: new FormControl(''),
      })
    });
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

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

  reset(){
    
  }

}
