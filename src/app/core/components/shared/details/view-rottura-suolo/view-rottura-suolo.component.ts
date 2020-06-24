import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'view-rottura-suolo',
  templateUrl: './view-rottura-suolo.component.html',
  styleUrls: ['./view-rottura-suolo.component.scss']
})
export class ViewRotturaSuoloComponent implements OnInit {

  form: FormGroup;
  @Input() data: any;
  @Input() pavimentazioni;
  @Input() modifiable: boolean

  @Output() update_details = new EventEmitter();

  can_modify = false;

  isLoading = false;

  indirizzi = [];
  civici = [];

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
    private formService: FormUtilService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formService.createDetailsRotturaSuolo();
    this.apiService.getStradario().subscribe(result => {
      this.indirizzi = result['data'];
      this.patchExcavationAddress();
    })
    this.form.patchValue(this.data);
    this.form.get('description').patchValue(this.data);
    this.form.disable();
  }

  resetDetails(){
    this.form.patchValue(this.data);
    this.form.get('description').patchValue(this.data);
    this.patchExcavationAddress();
    this.form.disable();
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
    this.dialog.openMap(this.map_cfg,).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch (feature.type) {
            case 'scavo':
              this.form.get('excavation_details').get('geometry').patchValue(feature.features[0] || '');
              // this.form.get('details').get('excavation_details').get('area_number').patchValue(feature.area);
              break;
            case 'cantiere':
              this.form.get('building_site').get('geometry').patchValue(feature.features[0] || '');
            // this.form.get('details').get('building_site').get('area_number').patchValue(feature.area);
          }
        });
        console.log("Dati pratica", this.form.value);
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

  minDate() {
    var result = new Date();
    result.setDate(result.getDate() + 20);
    return result;
  }

  differenceDate(form: AbstractControl, value1: string, value2: string, dest: string) {
    if (form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined) {
      return;
    }
    if (form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined) {
      return;
    }
    let date1: any = new Date(form.get(value1).value);
    let date2: any = new Date(form.get(value2).value);
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
  }

  calculateMinDate(form: AbstractControl, target: string) {
    if (form.get(target).value === null || form.get(target).value === '') {
      return;
    }
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate()));
  }

  modify() {
    if (this.can_modify) {
      this.form.disable();
      this.resetDetails();
    } else {
      this.form.enable();
      this.form.get('start_date').disable();
      this.form.get('end_date').disable();
    }
    this.can_modify = !this.can_modify;
  }

  save() {
    if (this.form.valid) {
      this.isLoading = true;
      let result = this.form.getRawValue();
      this.formatData(result);
      this.update_details.next({ details: result });
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }

  completeModify() {
    this.isLoading = false;
    this.modify();
  }

  abortModify() {
    this.isLoading = false;
  }

  formatData(body: any) {
    if (body.end_date) {
      body.end_date = formatDate(body.end_date, "yyyy-MM-dd", "en");
    }
    if (body.start_date) {
      body.start_date = formatDate(body.start_date, "yyyy-MM-dd", "en");
    }
    if (body.description.notes == null || body.description.notes === undefined || body.description.notes === '') {
      delete body.description.notes;
    }
    if (body.insurance.amount) {
      body.insurance.amount = body.insurance.amount * 100;
    }
    this.parseGeometryAddress(body);
  }

  parseGeometryAddress(body: any){
    let addresses = body.excavation_details.related_addresses;
    console.log("Indirizzi",addresses);
    addresses.forEach(address => {
      if(typeof address.street_name != 'string'){
        address.street_name = address.street_name.toponimo;
      }
    })
  }

  patchExcavationAddress(){
    let controlArray = this.formAddress;
    controlArray.clear();       
    this.data.excavation_details.addresses.forEach((address, i) => {
      const fb = this.formService.geometryAddress();
      controlArray.push(fb);
      console.log(fb);
      let street = this.findStreet(address.street_name);
      fb.get('street_name').patchValue(street);
      this.onChangeStradario(fb.get('street_name'), i);
      fb.get('from_street_number').patchValue(address.from_street_number);
      fb.get('to_street_number').patchValue(address.to_street_number);
    });
    this.form.disable();
  }

  findStreet(street_name: string){
    return this.indirizzi.find(street => street.toponimo === street_name);
  }

  onChangeStradario(control: AbstractControl, target: string){
    console.log(control);
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
    items.push(this.formService.geometryAddress());
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
