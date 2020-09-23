import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { element } from 'protractor';

@Component({
  selector: 'view-owner',
  templateUrl: './view-owner.component.html',
  styleUrls: ['./view-owner.component.scss']
})
export class ViewOwnerComponent implements OnInit {

  form: FormGroup;
  @Input() data: any;
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipi_documento: any[];
  @Input() tipologie_contatto: any[];
  @Input() province: any[];
  @Input() nazioni: any[];
  comuni = {};
  can_modify = false;

  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) {

  }

  ngOnInit(): void {
    this.form = this.formService.createOwner();
    this.form.patchValue(this.data);
    this.changedTipologiaPersona(this.form, { value: this.form.get('type').value });
    this.patchParsedData(this.form.get('type').value);
    this.form.disable();
  }

  get formContacts() { return <FormArray>this.form.get('contacts'); }

  changedTipologiaPersona(form: AbstractControl, event: any) {
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

  patchParsedData(value) {
    switch (value) {
      case 'person':
        this.patchAddress('address/county', 'address/city');
        this.patchBirthPlace();
        this.patchDocument();
        this.patchBirthday();
        break;
      case 'business':
        this.patchAddress('address/county', 'address/city');
        this.patchContacts();
        break;
    }
  }

  patchContacts() {
    let controlArray = this.formContacts;
    controlArray.clear();
    this.data.contacts.forEach((contact) => {
      const fb = this.formService.createContact();
      controlArray.push(fb);
      fb.patchValue(contact);
    });
  }

  patchAddress(value: string, target: string) {
    this.form.get(value.split("/")).patchValue(this.data.address.county_code);
    this.checkValidationElseDisable(value, target);
    this.getComuniForPatch(value, target, this.data.address.city_code);
  }

  patchCounty(value: string, target_enable: string, target_disable: string) {
    let selected_county = this.province.find(element => element.code == this.data.birthplace.county)
    let selected_country = this.nazioni.find(element => element.code == 'IT');
    this.form.get(value.split("/")).patchValue(selected_county);
    this.form.get(target_disable.split("/")).patchValue(selected_country);
    this.getComuniBirthPlaceForPatch(value, target_enable, this.data.birthplace.city);
  }

  patchCountry(value: string, target: string) {
    let selected_country = this.nazioni.find(element => element.code == this.data.birthplace.county)
    this.form.get(value.split("/")).patchValue(selected_country);
    let value_field = this.form.get(value.split("/")).value;
    if (value_field != null && value_field != '' && value_field != undefined) {
      this.form.get(target.split("/")).disable();
    } else {
      this.form.get(target.split("/")).enable();
    }
  }

  patchDocument() {
    this.form.get(['document_type']).patchValue(this.data.document.type);
    this.form.get(['document_number']).patchValue(this.data.document.number);
  }

  patchBirthPlace() {
    if (this.data.birthplace.is_foreign) {
      this.patchCountry('country_of_birth', 'county_of_birth')
    } else {
      this.patchCounty('county_of_birth', 'birthplace', 'country_of_birth');
    }
  }

  patchBirthday() {
    if(this.data.birth_date){
      let date = this.data.birth_date.split("/");
      let year = date[2];
      let month = date[1];
      let day = date[0];
      this.form.get(['birthday']).patchValue(year+'-'+month+'-'+ day);
    } else {
      this.form.get(['birthday']).patchValue('');
    }
  }

  addContatto(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createContact());
  }

  removeItem(array: AbstractControl, index: number) {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.removeAt(index);
  }

  onChangeProvince(value: string, target: string) {
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  onChangeCounty(value: string, target_enable: string, target_disable: string) {
    this.checkValidationElseDisable(value, target_enable);
    this.checkValidationElseEnable(value, target_disable);
    this.getComuniBirthPlace(value, target_enable);
  }

  onChangeCountry(value: string, target: string) {
    let value_field = this.form.get(value.split("/")).value;
    if (value_field != null && value_field != '' && value_field != undefined && value_field.name.toString().toUpperCase() != 'ITALIA') {
      this.form.get(target.split("/")).disable();
    } else {
      this.form.get(target.split("/")).enable();
    }
  }

  getComuni(value: string, target: string) {
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
    });
  }

  getComuniBirthPlace(value: string, target: string) {
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince.code).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
    });
  }

  getComuniForPatch(value: string, target: string, patchValue: any) {
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      this.form.get(target.split("/")).patchValue(patchValue);
    });
  }

  getComuniBirthPlaceForPatch(value: string, target: string, patchValue: any) {
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince.code).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      let selected_city = this.comuni[this.toCamelCase(target)].find(element => element.code == patchValue)
      this.form.get(target.split("/")).patchValue(selected_city);
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

  checkValidationElseDisable(value: string, target: string) {
    if (this.form.get(value.split("/")).invalid) {
      this.form.get(target.split("/")).disable();
      this.form.get(target.split("/")).reset();
    } else {
      this.form.get(target.split("/")).enable();
      this.form.get(target.split("/")).reset();
    }
  }

  checkValidationElseEnable(value: string, target: string) {
    if (this.form.get(value.split("/")).invalid) {
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
