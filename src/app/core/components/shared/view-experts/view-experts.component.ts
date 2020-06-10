import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormUtilService } from 'src/app/core/services/form-util.service';

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

  expert_form: FormGroup;

  @Output() delete_expert = new EventEmitter();
  @Output() add_expert = new EventEmitter();


  createExpert = false;
  

  constructor(
    private formService: FormUtilService
  ) { }

  ngOnInit(): void {
  }

  delete(id: number){
    console.log("Delete expert: " + id);
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
      this.add_expert.next(this.expert_form.value);
    } else {
      console.log("Invalid form", this.expert_form.value);
    }
  }

}
