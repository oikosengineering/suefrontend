import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormArray } from '@angular/forms';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Component({
  selector: 'rottura-suolo',
  templateUrl: './rottura-suolo.component.html',
  styleUrls: ['./rottura-suolo.component.scss']
})
export class RotturaSuoloComponent implements OnInit {

  @Input() form: FormGroup;

  pavimentazioni = [];

  indirizzi = [];
  civici = [];
  minStartDate;
  minEndDate;

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
    private apiService: AppApiService,
    private formUtil: FormUtilService
  ) {
    this.apiService.getDizionario('building.details.flooring_type').subscribe(data => {
      this.pavimentazioni.push(...data['data']);
    });
    this.apiService.getStradario().subscribe(result => {
      this.indirizzi = result['data'];
    })
   }

  ngOnInit(): void {
    this.minStartDate = this.formUtil.setDateDelayFromToday(20);
    this.subscribeChanges();
  }

  get formAddress() { return <FormArray>this.form.get(['excavation_details', 'related_addresses']); }

  openMap() {
    event.preventDefault();
    event.stopPropagation();
    let features = [
      {
        type: 'scavo',
        features: this.form.get('excavation_details').get('geometry').value != '' ? [this.form.get('excavation_details').get('geometry').value] : []
      },
      {
        type: 'cantiere',
        features: this.form.get('building_site').get('geometry').value != '' ? [this.form.get('building_site').get('geometry').value] : []
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

  subscribeChanges(){
    this.form.get('start_date').valueChanges.subscribe((value) => {
      this.calculateMinDate(this.form, 'end_date');
    })
    this.form.get('end_date').valueChanges.subscribe((value) => {
      this.differenceDate(this.form, 'end_date', 'start_date', 'duration');
    })
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
    this.minEndDate = this.formUtil.setDate(form.get('start_date').value);
    this.differenceDate(form, 'end_date', 'start_date', 'total_duration');
  }

  checkDate(target: string, limit: string){
    let value = this.form.get(target).value
    let date: Date;
    let limit_date = new Date(limit);
    if(value){
      date = new Date(value);
      if(date < limit_date){
        this.form.get(target).setValue(limit);
        this.form.get(target).updateValueAndValidity();
      }
    }
  }

  onChangeStradario(control: AbstractControl, target: string){
    control.parent.get('from_street_number').reset();
    control.parent.get('to_street_number').reset();
    if(control.value){
      this.apiService.getCivici(control.value.id).subscribe(result => {
        this.civici[target] = result['data'];
      })
    } else {
      control.reset();
    }
  }

  addAddress(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formUtil.geometryAddress());
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
