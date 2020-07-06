import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.scss']
})
export class ExpertsComponent implements OnInit {
  @Input() form: FormArray;
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipologie_contatto: any[];
  @Input() titoli_professionali: any[];
  @Input() province: any[];
  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
  }

  get formExperts() {return <FormArray>this.form;}
  
  addExpert(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createExpertBusiness());
  }

  removeItem(array: AbstractControl, index: number){
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.removeAt(index);
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
