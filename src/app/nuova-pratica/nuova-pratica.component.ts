import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../core/services/validation.service';
import { AppApiService } from '../core/services/app-api.service';

@Component({
  selector: 'app-nuova-pratica',
  templateUrl: './nuova-pratica.component.html',
  styleUrls: ['./nuova-pratica.component.scss']
})
export class NuovaPraticaComponent implements OnInit {

  options = [];
  
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private apiservice: AppApiService
  ) {}

  ngOnInit() {

    this.apiservice.getDizionario('procedure.category').subscribe(data => {
      this.options.push(...data['data']);
    });

    this.firstFormGroup = this.formBuilder.group({
      tipo_pratica: [null, Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      oggetto: ['', Validators.compose(
        [
          Validators.required,
          Validators.maxLength(80)
        ]
      )],
      descrizione: ['', Validators.compose(
        [
          Validators.maxLength(255)
        ]
      )]
    });
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

  getPratica(){
    let value = this.options.find(option => option.value == this.firstFormGroup.value.tipo_pratica);
    if(value){
      return value.name;
    } else {
      return '';
    }
  }

  submit(){
    console.log("Tipo: ", this.firstFormGroup.value);
    console.log("Info: ", this.secondFormGroup.value);
    this.router.navigate(['/pratiche', this.firstFormGroup.value.tipo_pratica, "test-pratica"]);
  }

}
