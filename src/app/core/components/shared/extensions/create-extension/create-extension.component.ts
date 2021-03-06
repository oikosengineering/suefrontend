import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'create-extension',
  templateUrl: './create-extension.component.html',
  styleUrls: ['./create-extension.component.scss']
})
export class CreateExtensionComponent implements OnInit {

  form: FormGroup;
  @Input() min_date: any;
  @Output() add_extension = new EventEmitter();

  min_value_date: string;

  isLoading = false;
  createExtension = false;

  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formService.createExtension();
    this.setMinDate();
  }

  setMinDate() {
    this.min_value_date = this.formService.setDate(this.min_date,  1);
  }

  isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  save() {
    if (this.form.valid) {
      this.isLoading = true;
      let extension = this.form.value;
      this.parseDate(extension)
      this.add_extension.next(this.form.value);
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }

  parseDate(body: any) {
    body.end_date = formatDate(body.end_date, "yyyy-MM-dd", "en");
  }

  uploadComplete() {
    this.form.reset();
    this.newExtension();
    this.isLoading = false;
  }

  newExtension() {
    if (this.checkMinDate()) {
      if (this.createExtension) {
        this.form = null;
      } else {
        this.form = this.formService.createExtension();
      }
      this.createExtension = !this.createExtension;
    } else {
      this.snackBar.open('La richiesta deve pervenire almeno entro 7 giorni dalla scadenza', 'Chiudi', { duration: 4000 });
    }
  }

  checkMinDate(): boolean {
    var target: any = new Date(this.min_date.split("/").reverse());
    if (!this.isValidDate(target)) {
      target = new Date(this.min_date);
    }
    let today: any = new Date();
    let diference = Math.floor((target - today) / (1000 * 60 * 60 * 24));
    return diference >= 7;
  }

  checkDate(target: string, limit: string){
    let value = this.form.get(target).value
    let date: Date;
    let limit_date = new Date(limit);
    
    if(value){
      date = new Date(value);
      console.log(limit_date);
      console.log(date)
      if(date < limit_date){
        this.form.get(target).setValue(limit);
        this.form.get(target).updateValueAndValidity();
        console.log(this.form.get(target).value);
      }
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
