import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { min } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

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
        tooltip: 'Disegna area occupazione suolo pubblico',
        target: 'occupazione'
      },
    ],
    layers: [
      {
        name: "Occupazione suolo pubblico",
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
    this.minStartDate = new Date();
    this.minStartDate.setDate(this.minStartDate.getDate() + 20);
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
