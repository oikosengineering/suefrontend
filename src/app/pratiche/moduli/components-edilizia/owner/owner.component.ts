import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipi_documento: any[];
  @Input() tipologie_contatto: any[];
  @Input() province: any[];
  @Input() nazioni: any[];
  comuni = {};
  loading = false;
  
  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
  }

  get formContacts() { return <FormArray>this.form.get('contacts'); }

  changedTipologiaPersona(form: AbstractControl, event: MatSelectChange) {
    switch (event.value) {
      case 'person':
        form.get('first_name').enable()
        form.get('last_name').enable();
        form.get('fiscal_code').enable();
        form.get('gender').enable();
        form.get('county_of_birth').enable();
        form.get('country_of_birth').enable();
        form.get('birthday').enable();
        form.get('document_type').enable();
        form.get('document_number').enable();
        form.get('contacts').disable();
        form.get('name').disable();
        form.get('vat').disable();
        break;
      case 'business':
        form.get('first_name').disable()
        form.get('last_name').disable();
        form.get('fiscal_code').disable();
        form.get('gender').disable();
        form.get('birthplace').disable();
        form.get('birthplace').reset();
        form.get('county_of_birth').disable();
        form.get('county_of_birth').reset();
        form.get('country_of_birth').disable();
        form.get('country_of_birth').reset();
        form.get('birthday').disable();
        form.get('document_type').disable();
        form.get('document_number').disable();
        form.get('name').enable();
        form.get('contacts').enable();
        form.get('vat').enable();
        break;
    }
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
    this.loading = true;
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  onChangeCounty(value: string, target_enable: string, target_disable: string){
    this.loading = true;
    this.checkValidationElseDisable(value, target_enable);
    this.checkValidationElseEnable(value, target_disable);
    this.getComuniBirthPlace(value, target_enable);
  }

  onChangeCountry(value: string, target: string){
    let value_field = this.form.get(value.split("/")).value;
    if(value_field != null && value_field != '' && value_field != undefined){
      this.form.get(target.split("/")).disable();
    } else {
      this.form.get(target.split("/")).enable();
    }
  }

  getComuni(value: string, target: string){
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      this.loading = false;
    });
  }

  getComuniBirthPlace(value: string, target: string){
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince.code).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      this.loading = false;
    });
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
  
  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
