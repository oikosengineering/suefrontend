import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AppApiService } from 'src/app/core/services/app-api.service';

@Component({
  selector: 'documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() type: string;
  @Input() name: string;
  @Input() documenti: any[];
  constructor(
    private validationService: ValidationService,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
  }


  uploadFile(event, form: AbstractControl, control: string) {
    if (event.target.files[0]) {
      this[control].push(event.target.files[0]);
      event.target.value = "";
      form.get('file').disable();
    }
  }

  removeFile(target, form: AbstractControl, control: string) {
    let index = this[control].indexOf(target);
    if (index >= 0) {
      this[control].splice(index, 1);
      form.get('file').enable();
    }
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

}
