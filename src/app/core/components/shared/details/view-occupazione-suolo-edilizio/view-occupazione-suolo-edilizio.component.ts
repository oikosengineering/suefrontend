import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'view-occupazione-suolo-edilizio',
  templateUrl: './view-occupazione-suolo-edilizio.component.html',
  styleUrls: ['./view-occupazione-suolo-edilizio.component.scss']
})
export class ViewOccupazioneSuoloEdilizioComponent implements OnInit {
  
  form: FormGroup;
  @Input() data: any;
  @Input() modifiable: boolean
  
  @Output() update_details = new EventEmitter();

  can_modify = false;

  isLoading = false; 

  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
  ) { }

  ngOnInit(): void {
    this.form = this.formService.createDetailsOccupazioneSuoloEdilizio();
    let result = Object.assign({}, this.data);
    if(!result.other){
      delete result.other;
    }
    console.log(result);
    this.form.patchValue(result);
    this.patchDate();
    this.form.disable();
  }

  patchDate(){
    this.form.get('start_date').patchValue(new Date(this.data.start_date.split("/").reverse()));
    this.form.get('end_date').patchValue(new Date(this.data.end_date.split("/").reverse()));
  }

  minDate(){
    var result = new Date();
    result.setDate(result.getDate() + 15);
    return result;
  }

  differenceDate(form: AbstractControl, value1: string, value2: string, dest: string) {
    if (form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined)
      return;
    if (form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined)
      return;
    let date1: any = new Date(form.get(value1).value);
    let date2: any = new Date(form.get(value2).value);
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
  }

  calculateMinDate(form: AbstractControl, target: string) {
    if (form.get(target).value === null || form.get(target).value === '')
      return;
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate()));
  }

  changeOther(event: MatCheckboxChange, control: AbstractControl){
    this.checkOther(event.checked, control);
  }

  checkOther(value: boolean, control: AbstractControl){
    switch(value){
      case true:
        control.enable();
        control.updateValueAndValidity();
        break;
      case false:
        control.disable()
        control.updateValueAndValidity();
        break;
    }
  }

  modify(){
    if(this.can_modify){
      this.form.disable();
    } else {
      this.form.enable();
      let isOther = this.data.other ? true : false;
      this.checkOther(isOther, this.form.get('other'));
      this.form.get('start_date').disable();
      this.form.get('end_date').disable();
    }
    this.can_modify = !this.can_modify;
  }

  save(){
    if(this.form.valid){
      this.isLoading = true
      let result = this.form.getRawValue();
      this.formatData(result);
      this.update_details.next({details: result});
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }

  completeModify(){
    this.isLoading = false;
    this.modify()
  }

  abortModify(){
    this.isLoading = false;
  }

  formatData(body: any){
    if(body.end_date){
      body.end_date = formatDate(body.end_date, "yyyy-MM-dd", "en");
    }
    if(body.start_date){
      body.start_date = formatDate(body.start_date, "yyyy-MM-dd", "en");
    }
    if(body.intersection_address == null || body.intersection_address == undefined || body.intersection_address == ''){
      delete body.intersection_address;
    }
    if(body.other.width == null || body.other.width == undefined || body.other.width == ''){
      delete body.other.width
    }
    if(body.other.total_square_meters == null || body.other.total_square_meters == undefined || body.other.total_square_meters == ''){
      delete body.other.total_square_meters;
    }
    if(body.other.length == null || body.other.length == undefined || body.other.length == ''){
      delete body.other.length;
    }
    if(body.other.description == null || body.other.description == undefined || body.other.description == ''){
      delete body.other.description;
    }
  }
  
  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}