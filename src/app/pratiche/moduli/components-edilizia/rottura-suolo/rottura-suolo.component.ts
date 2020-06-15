import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { AppApiService } from 'src/app/core/services/app-api.service';

@Component({
  selector: 'rottura-suolo',
  templateUrl: './rottura-suolo.component.html',
  styleUrls: ['./rottura-suolo.component.scss']
})
export class RotturaSuoloComponent implements OnInit {

  @Input() form: FormGroup;

  pavimentazioni = [];

  map_cfg = {
    buttons: [
      {
        name: "Scavo",
        style: 'style_scavo',
        geometryType: 'Polygon',
        tooltip: 'Disegna area scavo',
        target: 'scavo'
      },
      {
        name: "Cantiere",
        style: 'style_cantiere',
        geometryType: 'Polygon',
        tooltip: 'Disegna area Cantiere',
        target: 'cantiere'
      }
    ],
    layers: [
      {
        name: "Scavo",
        style: "style_scavo",
        id: 'scavo'
      },
      {
        name: "Cantiere",
        style: "style_cantiere",
        id: 'cantiere'
      }
    ],
    features: [
      {
        type: 'scavo',
        features: []
      },
      {
        type: 'cantiere',
        features: []
      }
    ]
  };

  constructor(
    private dialog: DialogMessageService,
    private validationService: ValidationService,
    private apiservice: AppApiService
  ) {
    this.apiservice.getDizionario('building.details.flooring_type').subscribe(data => {
      this.pavimentazioni.push(...data['data']);
    });
   }

  ngOnInit(): void {
    console.log(this.form);
  }

  openMap() {
    event.preventDefault();
    event.stopPropagation();
    let features = [
      {
        type: 'scavo',
        features: this.form.get('building_site').get('geometry').value != '' ? [this.form.get('building_site').get('geometry').value != ''] : []
      },
      {
        type: 'cantiere',
        features: this.form.get('building_site').get('geometry').value != '' ? [this.form.get('building_site').get('geometry').value != ''] : []
      }
    ]
    this.map_cfg.features = features;
    this.dialog.openMap(this.map_cfg, ).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch(feature.type){
            case 'scavo':
              this.form.get('excavation_details').get('geometry').patchValue(feature.features[0] || '');
              // this.form.get('details').get('excavation_details').get('area_number').patchValue(feature.area);
              break;
            case 'cantiere':
              this.form.get('building_site').get('geometry').patchValue(feature.features[0] || '');
              // this.form.get('details').get('building_site').get('area_number').patchValue(feature.area);
          }
        });
        console.log("Dati pratica",this.form.value);
      }
      console.log('Mappa chiusa', value);
    }, error => {
      console.log('errore mappa');
    });
  }

  multiplicationPolizza(form: AbstractControl, value1: string, value2: string, dest: string) {
    if (form.get(value1.split("/")).value === null || form.get(value1.split("/")).value === '' || form.get(value2.split("/")).value === undefined)
      return;
    if (form.get(value2.split("/")).value === null || form.get(value2.split("/")).value === '' || form.get(value2.split("/")).value === undefined) {
      return;
    } else {
      let min = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2.split("/")).value).min;
      form.get(dest.split("/")).clearValidators();
      form.get(dest.split("/")).setValidators(Validators.min(min));
      form.get(dest.split("/")).updateValueAndValidity();
    }
    let pavimentazione = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2.split("/")).value);
    let price = pavimentazione.price;
    let min = pavimentazione.min;
    let tot = Math.floor(price * form.get(value1.split("/")).value);
    if (tot >= min) {
      form.get(dest.split("/")).patchValue(tot);
    } else {
      form.get(dest.split("/")).patchValue(min);
    }
  }

  minDate(){
    var result = new Date();
    result.setDate(result.getDate() + 20);
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

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }
}
