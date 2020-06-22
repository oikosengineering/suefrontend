import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'view-traslochi-lavori',
  templateUrl: './view-traslochi-lavori.component.html',
  styleUrls: ['./view-traslochi-lavori.component.scss']
})
export class ViewTraslochiLavoriComponent implements OnInit {
  
  form: FormGroup;
  @Input() data: any;
  @Input() modifiable: boolean

  @Output() update_details = new EventEmitter();
  
  can_modify = false;

  isLoading = false; 

  tipologie = [
    {value: 'vehicle', name: 'Veicolo'},
    {value: 'other', name: 'Altro'},
    {value: 'stopover', name: 'Sosta'}
  ]

  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
  ) { }

  ngOnInit(): void {
    this.form = this.formService.createDetailsOccupazioneSuoloPubblicoTraslochiLavori();
    this.form.patchValue(this.data);
    this.patchDate();
    this.form.disable();
  }

  patchDate(){
    this.form.get('start_time').setValue(this.formatTime(this.data.start_time));
    this.form.get('end_time').setValue(this.formatTime(this.data.end_time));
    this.form.get('start_date').patchValue(new Date(this.data.start_date.split("/").reverse()));
    if(this.data.end_date){
      this.form.get('end_date').patchValue(new Date(this.data.end_date.split("/").reverse()));
    }
  }

  formatTime(time: string){
    let re = /^\d{1}:\d{2}$/;
    if(time.match(re)){
      return '0' + time;
    } else {
      return time;
    }
  }

  changeTipologia(event: any, target: string[]){
    let value = event.value
    if(value === 'stopover'){
      target.forEach(element => {
        this.form.get(element.split("/")).disable();
      });
    } else {
      target.forEach(element => {
        this.form.get(element.split("/")).enable();
      });
    }
  }

  minDate(){
    var result = new Date();
    result.setDate(result.getDate() + 20);
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

  modify(){
    if(this.can_modify){
      this.form.disable();
    } else {
      this.form.enable();
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
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

}
