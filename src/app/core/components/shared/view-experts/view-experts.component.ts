import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'view-experts',
  templateUrl: './view-experts.component.html',
  styleUrls: ['./view-experts.component.scss']
})
export class ViewExpertsComponent implements OnInit {

  @Input() experts: any[];
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipologie_contatto: any[];
  @Input() titoli_professionali: any[];
  @Input() province: any[];
  @Input() modifiable: boolean;

  expert_form: FormGroup;

  @Output() delete_expert = new EventEmitter();
  @Output() add_expert = new EventEmitter();


  createExpert = false;
  isLoading = false;

  constructor(
    private formService: FormUtilService,
    private validationService: ValidationService,
  ) { }

  ngOnInit(): void {
  }

  delete(id: number){
    console.log("Delete expert: " + id);
    this.isLoading = true;
    this.delete_expert.next(id);
  }

  newExpert(){
    if(this.createExpert){
      this.expert_form = null;
    } else {
      this.expert_form = this.formService.createExpertBusiness();
    }
    this.createExpert = !this.createExpert;
  }

  addExpert(){
    if(this.expert_form.valid){
      this.isLoading = true;
      this.add_expert.next(this.expert_form.value);
    } else {
      this.validationService.validateAllFormFields(this.expert_form);
    }
  }

  completeAddExpert(){
    this.newExpert();
    this.isLoading = false;
  }

  abortAddExpert(){
    this.isLoading = false;
  }

}
