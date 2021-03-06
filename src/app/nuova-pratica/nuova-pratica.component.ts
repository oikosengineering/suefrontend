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
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private apiservice: AppApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.apiservice.getDizionarioById('procedure.category').subscribe(data => {
      this.options.push(...data['data']);
      this.loading = false;
    });

    this.firstFormGroup = this.formBuilder.group({
      tipo_pratica: [null, Validators.required]
    });
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

  getPratica() {
    let value = this.options.find(option => option.value == this.firstFormGroup.value.tipo_pratica);
    if (value) {
      return value.name;
    } else {
      return '';
    }
  }

  submit() {
    console.log("Tipo: ", this.firstFormGroup.value);
    this.router.navigate(['/pratiche', this.firstFormGroup.value.tipo_pratica]);
  }

}
