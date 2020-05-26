import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { BrowserStack } from 'protractor/built/driverProviders';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import CodiceFiscale  from 'codice-fiscale-js';
import { Province, City, Professional_Title} from 'src/app/core/models/models';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-richiesta-rottura-suolo',
  templateUrl: './richiesta-rottura-suolo.component.html',
  styleUrls: ['./richiesta-rottura-suolo.component.scss']
})
export class RichiestaRotturaSuoloComponent implements OnInit {
  form: FormGroup;
  tipologie = [];
  generi = [];
  pavimentazioni = [];
  esecutori = [];
  tipologie_contatto = [];
  qualifiche = [];
  tipi_documento = [];

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

  @Output() saved = new EventEmitter<boolean>();

  saved_form = true;

  file_bollo = [];
  planimetria1 = [];
  planimetria2 = [];
  polizza_fidejussoria = [];

  isUserLoggedIn = false;
  selectedOwnerProvincia: Province;
  selectedOwnerAddressProvincia: Province;
  province: Province[] = [];
  comuni = {};
  titoli_professionali = [];

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dialog: DialogMessageService,
    private router: Router,
    private formService: FormUtilService,
    private apiservice: AppApiService
  ) { }

  ngOnInit(): void {
    this.apiservice.getProvince().subscribe(data => {
      this.province.push(...data['data']);
    });

    this.apiservice.getTitoliProfessionali().subscribe(data => {
      this.titoli_professionali.push(...data['data']);
    });

    this.apiservice.getDizionario('owner.type').subscribe(data => {
      this.tipologie.push(...data['data']);
    });

    this.apiservice.getDizionario('gender').subscribe(data => {
      this.generi.push(...data['data']);
    });

    this.apiservice.getDizionario('building.details.flooring_type').subscribe(data => {
      this.pavimentazioni.push(...data['data']);
    });

    this.apiservice.getDizionario('experts.work_supplier').subscribe(data => {
      this.esecutori.push(...data['data']);
    });

    this.apiservice.getDizionario('contacs.type').subscribe(data => {
      this.tipologie_contatto.push(...data['data']);
    });

    this.apiservice.getDizionario('experts.qualification').subscribe(data => {
      this.qualifiche.push(...data['data']);
    });

    this.apiservice.getDizionario('owner.person.document_type').subscribe(data => {
      this.tipi_documento.push(...data['data']);
    });

    this.createForm();
    this.checkState();
    this.form.valueChanges.subscribe(value => {
      if (this.form.touched) {
        this.saved_form = false;
        this.saved.emit(this.saved_form);
      }
    });
  }

  save(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isUserLoggedIn) {
      this.saved_form = true;
      this.form.markAsUntouched();
      this.saved.emit(this.saved_form);
    } else {
      this.router.navigate(['/login']);
    }
  }

  createForm() {
    this.form = this.fb.group({
      category: new FormControl('rottura_suolo'),
      delegated: new FormControl(false),
      owner_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      owner: this.formService.createOwner(),
      // expert: this.createExpertBusiness(),
      experts: this.fb.array([this.formService.createExpertBusiness()]),
      details: this.formService.createDetailsRotturaSuolo(),
      work_supplier: new FormControl('self', Validators.compose([
        Validators.required
      ])),
      supplier_business: this.formService.createBusiness(),
      qualification: new FormControl('owner', Validators.compose([
        Validators.required
      ])),
      business_administrator: this.formService.createExpert(),
      stamp_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      // allegati_pratica: this.fb.group({
      //   marca_bollo: this.fb.group({
      //     codice_bollo: new FormControl('', Validators.compose([
      //       Validators.required
      //     ])),
      //     file: new FormControl('', Validators.compose([
      //       Validators.required
      //     ])),
      //   }),
      //   planimetria1: this.fb.group({
      //     file: new FormControl('', Validators.compose([
      //       Validators.required
      //     ])),
      //   }),
      //   planimetria2: this.fb.group({
      //     file: new FormControl('', Validators.compose([
      //       Validators.required
      //     ])),
      //   }),
      //   polizza_fidejussoria: this.fb.group({
      //     file: new FormControl('', Validators.compose([
      //       Validators.required
      //     ])),
      //   }),
      // })
    });
  }

  get formOwner() { return this.form.get('owner'); }
  get formExpert() { return this.form.get('expert'); }
  get formExperts() {return <FormArray>this.form.get('experts');}
  get formDittaLavori() { return this.form.get('supplier_business'); }
  get formDatiPratica() { return this.form.get('details'); }
  get formContactsDitta() { return <FormArray>this.form.get('supplier_business').get('contacts'); }
  get formContactsExpert() { return <FormArray>this.form.get('expert').get('contacts'); }
  get formContactsOwner() { return <FormArray>this.form.get('owner').get('contacts'); }

  getArray(value: string){
    return <FormArray>this.form.get(value.split("/"));
  }

  subscriptionForChange(list: string[], target: string[]){
    list.forEach(element => {
      this.form.get(element.split("/")).valueChanges.subscribe(()=>this.forceValidControl(target));
    });
  }

  forceValidControl(list: string[]){
    list.forEach(element => {
      this.form.get(element.split("/")).updateValueAndValidity();
    });
  }

  addContatto(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createContact());
  }

  removeItem(array: AbstractControl, index: number){
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.removeAt(index);
  }

  addExpert(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createExpertBusiness());
  }

  checkState(){
    // if(!this.form.get('delegated').value){
    //   this.form.get('experts').disable();
    //   this.form.get('experts').updateValueAndValidity();
    // }
    if(this.form.get('qualification').value == 'owner'){
      this.form.get('business_administrator').disable();
      this.form.get('business_administrator').updateValueAndValidity();
    }
    if(this.form.get('work_supplier').value == 'self'){
      this.form.get('supplier_business').disable();
      this.form.get('supplier_business').updateValueAndValidity();
    }
    this.subscriptionForChange(['owner/first_name', 'owner/last_name', 'owner/gender', 'owner/birthday', 'owner/birthplace', 'owner/county_of_birth'], ['owner/fiscal_code']);
  }

  differenceDate(form: AbstractControl, value1: string, value2: string, dest: string) {
    if (form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined)
      return;
    if (form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined)
      return;
    let date1: any = new Date(form.get(value1).value);
    let date2: any = new Date(form.get(value2).value);
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)) + 1);
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
    result.setDate(result.getDate() + 15);
    return result;
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

  calculateFiscalCode(form: AbstractControl){
    let dati = {
      name: form.get('first_name').value,
      surname: form.get('last_name').value,
      gender: form.get('gender').value,
      day: new Date(form.get('birthday').value).getDate(),
      month: new Date(form.get('birthday').value).getMonth() + 1,
      year: new Date(form.get('birthday').value).getFullYear(),
      birthplace: form.get('birthplace').value, 
      birthplaceProvincia: form.get('county_of_birth').value
    }
    console.log(dati);
    const cf = new CodiceFiscale(dati);
    console.log(cf);
    form.get('fiscal_code').patchValue(cf);
  }

  calculateValueFromFiscalCode(form: AbstractControl){
    event.preventDefault();
    event.stopPropagation();
    const cf = new CodiceFiscale(form.get('fiscal_code').value).toJSON();
    form.get('gender').patchValue(cf.gender);
    form.get('birthday').patchValue(new Date(cf.year, cf.month-1, cf.day));
    form.get('county_of_birth').patchValue(cf.birthplaceProvincia);
    this.onChangeProvinceFiscalCode('owner/county_of_birth', 'owner/birthplace', cf.birthplace);
    console.log(this.comuni[this.toCamelCase('owner/birthplace')]);
    console.log(cf.birthplace);
    form.get('birthplace').patchValue(cf.birthplace);
  }

  changedTipologiaPersona(form: AbstractControl, event: MatSelectChange) {
    switch (event.value) {
      case 'person':
        form.get('first_name').enable()
        form.get('last_name').enable();
        form.get('fiscal_code').enable();
        form.get('gender').enable();
        form.get('birthplace').enable();
        form.get('county_of_birth').enable();
        form.get('birthday').enable();
        form.get('document_type').enable();
        form.get('document_number').enable();
        form.get('contacts').disable();
        form.get('name').disable();
        form.get('vat').disable();
        // form.get('name').clearValidators()
        // form.get('name').updateValueAndValidity();
        // form.get('vat').clearValidators()
        // form.get('vat').updateValueAndValidity();
        break;
      case 'business':
        form.get('first_name').disable()
        form.get('last_name').disable();
        form.get('fiscal_code').disable();
        form.get('gender').disable();
        form.get('birthplace').disable();
        form.get('county_of_birth').disable();
        form.get('birthday').disable();
        form.get('document_type').disable();
        form.get('document_number').disable();
        form.get('name').enable();
        form.get('contacts').enable();
        form.get('vat').enable();
        // form.get('name').setValidators([Validators.required]);
        // form.get('name').updateValueAndValidity();
        // form.get('vat').setValidators([Validators.required]);
        // form.get('vat').updateValueAndValidity();
        break;
    }
  }

  changedTipologiaEsperto(form: AbstractControl, event: MatSelectChange) {
    switch (event.value) {
      case 'person':
        form.get('first_name').enable()
        form.get('last_name').enable();
        form.get('fiscal_code').enable();
        form.get('gender').enable();
        form.get('professional_title').enable();
        form.get('contacts').disable();
        form.get('name').clearValidators();
        form.get('name').updateValueAndValidity();
        break;
      case 'business':
        form.get('first_name').disable()
        form.get('last_name').disable();
        form.get('fiscal_code').disable();
        form.get('gender').disable();
        form.get('professional_title').disable();
        form.get('name').enable();
        form.get('contacts').enable();
        form.get('name').setValidators([Validators.required]);
        form.get('name').updateValueAndValidity();
        break;
    }
  }

  changeEsecutore(event: MatRadioChange, control: AbstractControl){
    switch(event.value){
      case 'self':
        control.disable()
        control.updateValueAndValidity();
        break;
      case 'business':
        control.enable();
        control.updateValueAndValidity();
        break;
    }
  }
  
  changeDelegated(event: MatCheckboxChange, control: AbstractControl){
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

  changeQualification(event: MatRadioChange, control: AbstractControl){
    switch(event.value){
      case 'owner':
        control.disable();
        control.updateValueAndValidity();
        break;
      default:
        control.enable()
        control.updateValueAndValidity();
      break;
    }
  }

  check(form: AbstractControl, field: string, target: string) {
    if (form.get(field).value == '' || form.get(field).value == null || form.get(field).value === undefined) {
      form.get(target).setValidators(Validators.required);
      form.get(target).updateValueAndValidity();
    } else {
      form.get(target).clearValidators();
      form.get(target).updateValueAndValidity();
    }

  }

  uploadFile(event, form: AbstractControl, control: string) {
    if (event.target.files[0]) {
      this[control].push(event.target.files[0]);
      event.target.value = "";
      form.get('file').disable()
    }
  }

  removeFile(target, form: AbstractControl, control: string) {
    let index = this[control].indexOf(target);
    if (index >= 0) {
      this[control].splice(index, 1);
      form.get('file').enable()
    }
  }

  openMap() {
    event.preventDefault();
    event.stopPropagation();
    let features = [
      {
        type: 'scavo',
        features: this.form.get('details').get('excavation_details').get('geometry').value
      },
      {
        type: 'cantiere',
        features: this.form.get('details').get('building_site').get('geometry').value
      }
    ]
    this.map_cfg.features = features;
    this.dialog.openMap(this.map_cfg, ).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch(feature.type){
            case 'scavo':
              this.form.get('details').get('excavation_details').get('geometry').patchValue(feature.features);
              this.form.get('details').get('excavation_details').get('area_number').patchValue(feature.area);
              break;
            case 'cantiere':
              this.form.get('details').get('building_site').get('geometry').patchValue(feature.features);
              this.form.get('details').get('building_site').get('area_number').patchValue(feature.area);
          }
        });
        console.log("Dati pratica",this.form.get('details').value);
      }
      console.log('Mappa chiusa', value);
    }, error => {
      console.log('errore mappa');
    });
  }

  submit() {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
    // if (true) {
      console.log(this.form.getRawValue());
      let raw_form = this.form.value;
      this.parseDate(raw_form);
      const body = JSON.stringify(raw_form);
      this.apiservice.creaPratica('building', body).subscribe((response) => {
        console.log(response);
      });

    } else {
      this.validationService.validateAllFormFields(this.form);
      const body = this.form.getRawValue();
      this.parseDate(body);
    }
  }

  parseDate(body){
    if(body.owner.birthday){
      body.owner.birthday = formatDate(body.owner.birthday, "yyyy-MM-dd", "en");
    }
    if(body.details.end_date){
      body.details.end_date = formatDate(body.details.end_date, "yyyy-MM-dd", "en");
    }
    if(body.details.start_date){
      body.details.start_date = formatDate(body.details.start_date, "yyyy-MM-dd", "en");
    }
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

  onChangeProvince(value: string, target: string){
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  onChangeProvinceFiscalCode(value: string, target: string, data: string){
    this.checkValidationElseDisable(value, target);
    this.getComuniAndPatch(value, target, data);
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

  getComuni(value: string, target: string){
    let selectProvince = this.form.get(value.split("/")).value;
    if(selectProvince != 'EE'){
      this.apiservice.getComuni(selectProvince).subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
      });
    } else {
      this.apiservice.getNazioni().subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
      });
    }
  }

  getComuniAndPatch(value: string, target: string, data: string){
    let selectProvince = this.form.get(value.split("/")).value;
    if(selectProvince != 'EE'){
      this.apiservice.getComuni(selectProvince).subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
        let result: City = this.comuni[this.toCamelCase(target)].find((comune: City) => comune.name.toLowerCase() === data.toLowerCase());
        this.form.get(target.split("/")).patchValue(result.name);
      });
    } else {
      this.apiservice.getNazioni().subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
        let result: City = this.comuni[this.toCamelCase(target)].find((comune: City) => comune.name.toLowerCase() === data.toLowerCase());
        this.form.get(target.split("/")).patchValue(result.name);
      });
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
  // changedOwnerProvince(form: AbstractControl, event: MatSelectChange) {
  //   this.selectedOwnerComune = null;
  //   this.selectedOwnerProvincia = this.province.find(prov => prov.code === event.value);
  //   if (this.selectedOwnerProvincia) {
  //     this.apiservice.getComuni(this.selectedOwnerProvincia.code).subscribe((data) => {
  //       if (data != null) {
  //         this.comuni = data['data'];
  //       }
  //     });
  //   }
  // }

  // changedOwnerComune(form: AbstractControl, event: MatSelectChange) {
  //   this.selectedOwnerComune = this.comuni.find(com => com.code === event.value);
  // }

  // changedOwnerAddressProvince(form: AbstractControl, event: MatSelectChange) {
  //   this.selectedOwnerAddressComune = null;
  //   this.selectedOwnerAddressProvincia = this.province.find(prov => prov.code === event.value);
  //   if (this.selectedOwnerAddressProvincia) {
  //     this.apiservice.getComuni(this.selectedOwnerAddressProvincia.code).subscribe((data) => {
  //       if (data != null) {
  //         this.comuni = data['data'];
  //       }
  //     });
  //   }
  // }

  // changedOwnerAddressComune(form: AbstractControl, event: MatSelectChange) {
  //   this.selectedOwnerAddressComune = this.comuni.find(com => com.code === event.value);
  // }

}
