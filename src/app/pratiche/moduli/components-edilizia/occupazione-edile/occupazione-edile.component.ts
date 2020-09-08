import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';

@Component({
  selector: 'app-occupazione-edile',
  templateUrl: './occupazione-edile.component.html',
  styleUrls: ['./occupazione-edile.component.scss']
})
export class OccupazioneEdileComponent implements OnInit {
  
  @Input() form: FormGroup;

  indirizzi = [];
  civici = [];
  minStartDate;
  minEndDate;

  map_cfg = {
    buttons: [
      {
        name: "Occupazione",
        style: 'style_scavo',
        geometryType: 'Polygon',
        tooltip: 'Disegna area occupazione edile',
        target: 'occupazione'
      },
    ],
    layers: [
      {
        name: "Occupazione edilizia",
        style: "style_scavo",
        id: 'occupazione'
      },
    ],
    features: [
      {
        type: 'occupazione',
        features: []
      }
    ]
  };

  constructor(
    private validationService: ValidationService,
    private apiService: AppApiService,
    private dialog: DialogMessageService
  ) { 
    this.apiService.getStradario().subscribe(result => {
      this.indirizzi = result['data'];
    })
  }

  ngOnInit(): void {
    this.form.get('other').disable();
    this.minStartDate = new Date();
    this.minStartDate.setDate(this.minStartDate.getDate() + 20);
  }

  // minDate(){
  //   var result = new Date();
  //   result.setDate(result.getDate() + 20);
  //   return result;
  // }

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
    this.minEndDate = new Date(this.minStartDate);
    this.differenceDate(form, 'end_date', 'start_date', 'total_duration');
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

  onChangeStradario(control: AbstractControl, target: string){
    this.form.get(target.split("/")).reset();
    if(control.value){
      this.apiService.getCivici(control.value.id).subscribe(result => {
        this.civici[this.toCamelCase(target)] = result['data'];
      })
    } else {
      control.reset();
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

  openMap() {
    event.preventDefault();
    event.stopPropagation();
    let features = [
      {
        type: 'occupazione',
        features: this.form.get('building_site').get('geometry').value != '' ? [this.form.get('building_site').get('geometry').value] : []
      }
    ]
    this.map_cfg.features = features;
    this.dialog.openMap(this.map_cfg).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch(feature.type){
            case 'occupazione':
              this.form.get('building_site').get('geometry').patchValue(feature.features[0] || '');
              break;
          }
        });
        console.log("Dati pratica",this.form.value);
      }
      console.log('Mappa chiusa', value);
    }, error => {
      console.log('errore mappa');
    });
  }
}
