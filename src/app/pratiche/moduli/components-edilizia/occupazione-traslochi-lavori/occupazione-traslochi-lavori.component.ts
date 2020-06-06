import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-occupazione-traslochi-lavori',
  templateUrl: './occupazione-traslochi-lavori.component.html',
  styleUrls: ['./occupazione-traslochi-lavori.component.scss']
})
export class OccupazioneTraslochiLavoriComponent implements OnInit {

  @Input() form: FormGroup;
  
  tipologie = [
    {value: 'vehicle', name: 'Veicolo'},
    {value: 'other', name: 'Altro'},
    {value: 'stopover', name: 'Sosta'}
  ]

  constructor(
    private validationService: ValidationService,
  ) { }

  ngOnInit(): void {
  }

  changeTipologia(event: MatSelectChange, target: string[]){
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
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)) + 1);
  }

  calculateMinDate(form: AbstractControl, target: string) {
    if (form.get(target).value === null || form.get(target).value === '')
      return;
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate()));
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

}