import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'expert',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.scss']
})
export class ExpertComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipologie_contatto: any[];
  @Input() titoli_professionali: any[];
  @Input() province: any[];
  comuni = {};

  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
  }

  get formContacts() { return <FormArray>this.form.get('contacts'); }

  changedTipologiaEsperto(form: AbstractControl, event: MatSelectChange) {
    switch (event.value) {
      case 'person':
        form.get('first_name').enable()
        form.get('last_name').enable();
        form.get('fiscal_code').enable();
        form.get('gender').enable();
        form.get('professional_title').enable();
        form.get('contacts').disable();
        form.get('name').clearValidators();
        form.get('name').updateValueAndValidity();
        break;
      case 'business':
        form.get('first_name').disable()
        form.get('last_name').disable();
        form.get('fiscal_code').disable();
        form.get('gender').disable();
        form.get('professional_title').disable();
        form.get('name').enable();
        form.get('contacts').enable();
        form.get('name').setValidators([Validators.required]);
        form.get('name').updateValueAndValidity();
        break;
    }
  }

  checkValidation(targets: string[]){
    let check = false;
    targets.forEach(target => {
      if(this.form.get(target.split("/")).invalid){
        check = true;
      }
    });
    return check;
  }

  addContatto(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createContact());
  }

  removeItem(array: AbstractControl, index: number){
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.removeAt(index);
  }

  onChangeProvince(value: string, target: string){
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  toCamelCase(sentenceCase) {
    var out = "";
    sentenceCase.split("/").forEach((element, index) => {
        var add = element.toLowerCase();
        out += (index === 0 ? add : add[0].toUpperCase() + add.slice(1));
    });
    return out;
  }

  checkValidationElseDisable(value: string, target: string){
    if(this.form.get(value.split("/")).invalid){
      this.form.get(target.split("/")).disable();
      this.form.get(target.split("/")).reset();
    } else {
      this.form.get(target.split("/")).enable();
      this.form.get(target.split("/")).reset();
    }
  }

  checkValidationElseEnable(value: string, target: string){
    if(this.form.get(value.split("/")).invalid){
      this.form.get(target.split("/")).enable();
      this.form.get(target.split("/")).reset();
    } else {
      this.form.get(target.split("/")).disable();
      this.form.get(target.split("/")).reset();
    }
  }

  getComuni(value: string, target: string){
    let selectProvince = this.form.get(value.split("/")).value;
    if(selectProvince != 'EE'){
      this.apiservice.getComuni(selectProvince).subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
      });
    } else {
      this.apiservice.getNazioni().subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
      });
    }
  }
  
  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
