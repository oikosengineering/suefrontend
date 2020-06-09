import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-occupazione-suolo-pubblico',
  templateUrl: './occupazione-suolo-pubblico.component.html',
  styleUrls: ['./occupazione-suolo-pubblico.component.scss']
})
export class OccupazioneSuoloPubblicoComponent implements OnInit {
  
  @Input() form: FormGroup;

  tipologie = [
    {value: 'less_than_year', name: "Minore di un anno"},
    {value: 'more_than_year', name: "Maggiore di un anno"},
    {value: 'permanent', name: "Permanente"}
  ];


  constructor(
    private validationService: ValidationService,
  ) { }

  ngOnInit(): void {
  }

  changeTipologia(event: MatSelectChange, target: string[]){
    let value = event.value
    if(value === 'permanent'){
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
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
  }

  calculateMinDate(form: AbstractControl, target: string) {
    if (form.get(target).value === null || form.get(target).value === '')
      return;
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate()));
  }

  changeOther(event: MatCheckboxChange, control: AbstractControl){
    switch(event.checked){
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

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

}
