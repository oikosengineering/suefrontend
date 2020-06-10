import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'documenti',
  templateUrl: './documenti.component.html',
  styleUrls: ['./documenti.component.scss']
})
export class DocumentiComponent implements OnInit {
  @Input() form: FormArray;
  @Input() modulo: string;
  @Input() documenti: any[];
  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
    console.log(this.form);
  }


  get formDocumenti() {return  this.form as FormArray; }

  addDocumento(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    const items = array as FormArray;
    items.push(this.formService.createDocumenti());
  }

  removeItem(array: AbstractControl, index: number) {
    event.preventDefault();
    event.stopPropagation();
    const items = array as FormArray;
    items.removeAt(index);
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
