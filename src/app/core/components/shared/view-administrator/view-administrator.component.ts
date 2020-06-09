import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AppApiService } from 'src/app/core/services/app-api.service';

@Component({
  selector: 'view-administrator',
  templateUrl: './view-administrator.component.html',
  styleUrls: ['./view-administrator.component.scss']
})
export class ViewAdministratorComponent implements OnInit {
  
  form: FormGroup;
  @Input() data: any;
  @Input() generi: any[];
  @Input() titoli_professionali: any[];
  @Input() tipologie_contatto: any[];
  @Input() province: any[];
  comuni = {};
  
  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
    this.form = this.formService.createExpert();
    this.form.patchValue(this.data);
    this.patchAddress('address/county', 'address/city');
    this.form.disable();
  }

  patchAddress(value: string, target: string){
    this.form.get(value.split("/")).patchValue(this.data.address.county_code);
    this.checkValidationElseDisable(value, target);
    this.getComuniForPatch(value, target, this.data.address.city_code);
  }

  getComuniForPatch(value: string, target: string, patchValue: any){
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      this.form.get(target.split("/")).patchValue(patchValue);
    });
  }

  checkValidation(targets: string[]){
    let check = false;
    targets.forEach(target => {
      if(this.form.get(target.split("/")).invalid){
        check = true;
      }
    });
    return check;
  }

  onChangeProvince(value: string, target: string){
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  getComuni(value: string, target: string){
    let selectProvince = this.form.get(value.split("/")).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
    });
  }

  checkValidationElseDisable(value: string, target: string){
    if(this.form.get(value.split("/")).invalid){
      this.form.get(target.split("/")).disable();
      this.form.get(target.split("/")).reset();
    } else {
      this.form.get(target.split("/")).enable();
      this.form.get(target.split("/")).reset();
    }
  }

  toCamelCase(sentenceCase) {
    var out = "";
    sentenceCase.split("/").forEach((element, index) => {
        var add = element.toLowerCase();
        out += (index === 0 ? add : add[0].toUpperCase() + add.slice(1));
    });
    return out;
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

}