import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { BrowserStack } from 'protractor/built/driverProviders';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import CodiceFiscale from 'codice-fiscale-js';
import { Province, City, Professional_Title } from 'src/app/core/models/models';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { toHtml } from '@fortawesome/fontawesome-svg-core';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-edilizia',
  templateUrl: './edilizia.component.html',
  styleUrls: ['./edilizia.component.scss']
})
export class EdiliziaComponent implements OnInit {
  @Input() modulo: string;
  @Input() ownertype: string;
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
        name: 'Scavo',
        style: 'style_scavo',
        geometryType: 'Polygon',
        tooltip: 'Disegna area scavo',
        target: 'scavo'
      },
      {
        name: 'Cantiere',
        style: 'style_cantiere',
        geometryType: 'Polygon',
        tooltip: 'Disegna area Cantiere',
        target: 'cantiere'
      }
    ],
    layers: [
      {
        name: 'Scavo',
        style: 'style_scavo',
        id: 'scavo'
      },
      {
        name: 'Cantiere',
        style: 'style_cantiere',
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
  valueChange: Subscription;
  personOwnerChange: Subscription;

  file_bollo = [];
  planimetria1 = [];
  planimetria2 = [];
  polizza_fidejussoria = [];
  fileobbligatori = [];

  isUserLoggedIn = false;
  user_id;
  province: Province[] = [];
  nazioni = [];
  comuni = {};
  titoli_professionali = [];

  loading = false;
  error = false;
  errormessage = '';
  errorcode = '';
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dialog: DialogMessageService,
    private router: Router,
    private formService: FormUtilService,
    private apiservice: AppApiService,
    private auth: AuthService,
    private el: ElementRef,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.user_id = this.auth.getIdUser();

    this.apiservice.getProvince().subscribe(data => {
      this.province.push(...data['data']);
    });

    this.apiservice.getTitoliProfessionali().subscribe(data => {
      this.titoli_professionali.push(...data['data']);
    });

    this.apiservice.getNazioni().subscribe(data => {
      this.nazioni.push(...data['data']);
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
    this.subscribeToChanges();
    this.loading = false;
  }

  subscribeToChanges() {
    this.valueChange = this.form.valueChanges.subscribe(value => {
      if (this.form.touched) {
        this.saved.emit(this.form.untouched);
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      category: new FormControl(this.modulo),
      user_id: new FormControl(this.user_id),
      // delegated: new FormControl(true), //da togliere
      owner: this.formService.createOwner(),
      experts: this.fb.array([this.formService.createExpertBusiness()]),
      details: this.getDetailsProcedures(this.modulo),
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
      // documenti: this.fb.array([this.formService.createDocumenti()]);
    });
  }

  get formOwner() { return this.form.get('owner'); }
  get formExpert() { return this.form.get('expert'); }
  get formExperts() { return <FormArray>this.form.get('experts'); }
  get formDittaLavori() { return this.form.get('supplier_business'); }
  get formDatiPratica() { return this.form.get('details'); }
  get formContactsDitta() { return <FormArray>this.form.get('supplier_business').get('contacts'); }
  get formContactsExpert() { return <FormArray>this.form.get('expert').get('contacts'); }
  get formContactsOwner() { return <FormArray>this.form.get('owner').get('contacts'); }
  // get formDocumenti() { return <FormArray>this.form.get('documenti'); };
  // get formDocumento() { return this.form.get('documento'); }

  getArray(value: string) {
    return <FormArray>this.form.get(value.split('/'));
  }

  getDetailsProcedures(value: string): FormGroup {
    switch (value) {
      case 'rottura_suolo':
        return this.formService.createDetailsRotturaSuolo();
      case 'occupazione_suolo_edilizio':
        return this.formService.createDetailsOccupazioneSuoloEdilizio();
      case 'occupazione_suolo_pubblico':
        return this.formService.createDetailsOccupazioneAreePubbliche();
      case 'traslochi_lavori':
        return this.formService.createDetailsOccupazioneSuoloPubblicoTraslochiLavori();
    }
  }

  subscriptionForChange(list: string[], target: string[]) {
    list.forEach(element => {
      this.form.get(element.split('/')).valueChanges.subscribe(() => this.forceValidControl(target));
    });
  }

  subscribeOwnerType() {
    this.form.get('owner.type').valueChanges.subscribe(() => {
      this.checkOwnerType();
    })
  }

  subscribeQualification() {
    this.form.get('qualification').valueChanges.subscribe((value) => {
      switch(value){
        case 'company_representative':
          this.form.get('business_administrator.vat').disable();
          break;
        case 'property_manager':
          this.form.get('business_administrator.vat').enable();
          break;
      }
    })
  }

  checkOwnerType(){
    if (this.form.get('owner.type').value == 'person' || this.form.get('owner.type').value == null) {
      this.form.get('qualification').patchValue('owner');
      this.form.get('business_administrator').disable();
      this.form.get('qualification').disable();
      // this.form.get('experts').disable();
    } else {
      // this.form.get('experts').enable();
      this.form.get('qualification').enable();
      this.form.get('qualification').reset();
      this.form.get('business_administrator').enable();
    }
  }

  forceValidControl(list: string[]) {
    list.forEach(element => {
      this.form.get(element.split('/')).updateValueAndValidity();
    });
  }

  addContatto(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.formService.createContact());
  }

  removeItem(array: AbstractControl, index: number) {
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

  checkState() {
    // if(!this.form.get('delegated').value){
    //   this.form.get('experts').disable();
    //   this.form.get('experts').updateValueAndValidity();
    // }
    if (this.form.get('qualification').value == 'owner') {
      this.form.get('business_administrator').disable();
      this.form.get('business_administrator').updateValueAndValidity();
    }
    if (this.form.get('work_supplier').value == 'self') {
      this.form.get('supplier_business').disable();
      this.form.get('supplier_business').updateValueAndValidity();
    }
    this.subscriptionForChange(['owner/first_name', 'owner/last_name', 'owner/gender', 'owner/birthday', 'owner/birthplace', 'owner/county_of_birth', 'owner/country_of_birth'], ['owner/fiscal_code']);
    this.checkOwnerType();
    this.subscribeOwnerType();
    this.subscribeQualification();
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

  multiplicationPolizza(form: AbstractControl, value1: string, value2: string, dest: string) {
    if (form.get(value1.split('/')).value === null || form.get(value1.split('/')).value === '' || form.get(value2.split('/')).value === undefined) {
      return;
    }
    if (form.get(value2.split('/')).value === null || form.get(value2.split('/')).value === '' || form.get(value2.split('/')).value === undefined) {
      return;
    } else {
      let min = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2.split('/')).value).min;
      form.get(dest.split('/')).clearValidators();
      form.get(dest.split('/')).setValidators(Validators.min(min));
      form.get(dest.split('/')).updateValueAndValidity();
    }
    let pavimentazione = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2.split('/')).value);
    let price = pavimentazione.price;
    let min = pavimentazione.min;
    let tot = Math.floor(price * form.get(value1.split('/')).value);
    if (tot >= min) {
      form.get(dest.split('/')).patchValue(tot);
    } else {
      form.get(dest.split('/')).patchValue(min);
    }
  }

  minDate() {
    var result = new Date();
    result.setDate(result.getDate() + 20);
    return result;
  }

  calculateMinDate(form: AbstractControl, target: string) {
    if (form.get(target).value === null || form.get(target).value === '') {
      return;
    }
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate()));
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

  calculateFiscalCode(form: AbstractControl) {
    const dati = {
      name: form.get('first_name').value,
      surname: form.get('last_name').value,
      gender: form.get('gender').value,
      day: new Date(form.get('birthday').value).getDate(),
      month: new Date(form.get('birthday').value).getMonth() + 1,
      year: new Date(form.get('birthday').value).getFullYear(),
      birthplace: form.get('birthplace').value,
      birthplaceProvincia: form.get('county_of_birth').value
    };
    const cf = new CodiceFiscale(dati);
    console.log(cf);
    form.get('fiscal_code').patchValue(cf);
  }

  calculateValueFromFiscalCode(form: AbstractControl) {
    event.preventDefault();
    event.stopPropagation();
    const cf = new CodiceFiscale(form.get('fiscal_code').value).toJSON();
    form.get('gender').patchValue(cf.gender);
    form.get('birthday').patchValue(new Date(cf.year, cf.month - 1, cf.day));
    form.get('county_of_birth').patchValue(cf.birthplaceProvincia);
    this.onChangeProvinceFiscalCode('owner/county_of_birth', 'owner/birthplace', cf.birthplace);
    console.log(this.comuni[this.toCamelCase('owner/birthplace')]);
    console.log(cf.birthplace);
    form.get('birthplace').patchValue(cf.birthplace);
  }

  changeEsecutore(event: MatRadioChange, control: AbstractControl) {
    switch (event.value) {
      case 'self':
        control.disable();
        control.updateValueAndValidity();
        break;
      case 'business':
        control.enable();
        control.updateValueAndValidity();
        break;
    }
  }

  changeDelegated(event: MatCheckboxChange, control: AbstractControl) {
    switch (event.checked) {
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

  // changeQualification(event: any, control: AbstractControl) {
  //   switch (event.value) {
  //     case 'owner':
  //       control.disable();
  //       control.updateValueAndValidity();
  //       break;
  //     default:
  //       control.enable();
  //       control.updateValueAndValidity();
  //       break;
  //   }
  // }

  checkQualification(value: string): boolean {
    if(value === 'owner' && this.form.get('owner.type').value == 'business'){
      return true;
    } else {
      return false;
    }
  }

  check(form: AbstractControl, field: string, target: string) {
    if (form.get(field).value === '' || form.get(field).value == null || form.get(field).value === undefined) {
      form.get(target).setValidators(Validators.required);
      form.get(target).updateValueAndValidity();
    } else {
      form.get(target).clearValidators();
      form.get(target).updateValueAndValidity();
    }

  }

  // uploadFile(event, form: AbstractControl, control: string) {
  //   if (event.target.files[0]) {
  //     this[control].push(event.target.files[0]);
  //     event.target.value = '';
  //     form.get('file').disable();
  //   }
  // }

  // removeFile(target, form: AbstractControl, control: string) {
  //   let index = this[control].indexOf(target);
  //   if (index >= 0) {
  //     this[control].splice(index, 1);
  //     form.get('file').enable()
  //   }
  // }

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
    this.dialog.openMap(this.map_cfg,).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch (feature.type) {
            case 'scavo':
              this.form.get('details').get('excavation_details').get('geometry').patchValue(feature.features);
              // this.form.get('details').get('excavation_details').get('area_number').patchValue(feature.area);
              break;
            case 'cantiere':
              this.form.get('details').get('building_site').get('geometry').patchValue(feature.features);
            // this.form.get('details').get('building_site').get('area_number').patchValue(feature.area);
          }
        });
        console.log('Dati pratica', this.form.get('details').value);
      }
      console.log('Mappa chiusa', value);
    }, error => {
      console.log('errore mappa');
    });
  }

  submit() {
    event.preventDefault();
    event.stopPropagation();
    this.valueChange.unsubscribe();
    this.form.markAllAsTouched();
    this.error = false;
    this.errorcode = '';
    this.errormessage = '';
    this.errors = [];
    console.log(this.form.getRawValue());
    if (this.form.valid) {
      this.loading = true;
      // if (true) {
      console.log(this.form.getRawValue());
      let raw_form = this.form.value;
      this.parseData(raw_form);
      const body = JSON.stringify(raw_form);
      this.apiservice.creaPratica('building', body).subscribe((response) => {
        console.table(response);
        if (response['status'] === 200) {
          this.loading = false;
          this.saved.emit(true);
          if(response['data'].id){
            this.router.navigate(['/dettagli-pratica', response['data'].id], {fragment: 'documents'});
          }
        } else {
          this.loading = false;
          this.snackBar.open("Impossibile inviare la pratica, contattare l'Amministratore di sitema", null, {duration: 3000});
        }
      }, error => {
        this.loading = false;
        if (error.error['errors'] !== null && error.error['errors'] !== undefined) {
          // tslint:disable-next-line: max-line-length
          if (error.error['errors'].error_code !== null && error.error['errors'].error_code !== undefined && error.error['errors'] !== '') {
            this.error = true;
            this.errorcode = error.error['errors'].error_code;
            this.errormessage = error.error['errors'].message;
            let errorstring = '\r\n';

            for (var obj in error.error['errors']['details']) {
              this.errors.push(obj);
              errorstring += (obj) + '\r\n';
            }
            this.dialog.openDialog('Attenzione', 'Sono stati riscontrati i seguenti errori:'  +  errorstring, '350px');
            // console.log(this.errors);
          }
        }
        this.loading = false;
        this.subscribeToChanges();
      });

    } else {
      for (let el in this.form.controls) {
        if (this.form.controls[el].invalid) {
          console.log(el)
        }
   }          
      
      this.validationService.validateAllFormFields(this.form);
      this.focusInvalidField();
      const body = this.form.getRawValue();
      this.parseData(body);
      this.subscribeToChanges();
    }
  }

  focusInvalidField() {
    let element = this.el.nativeElement.querySelector('mat-form-field .ng-invalid');
    if (element != null) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  parseData(body) {
    this.parseDate(body)
    switch (this.modulo) {
      case 'rottura_suolo':
        if (body.details.description.notes == null || body.details.description.notes == undefined || body.details.description.notes == '') {
          delete body.details.description.notes;
        }
        if (body.details.insurance.amount) {
          body.details.insurance.amount = body.details.insurance.amount * 100;
        }
        this.parseGeometryAddress(body);
        break;
      case 'occupazione_suolo_edilizio':
        this.parseAddress(body);
        this.parseIntersectionAddress(body);
        break;
      case 'occupazione_suolo_pubblico':
        this.parseAddress(body);
        break;
      case 'traslochi_lavori':
        this.parseAddress(body);
        break;
    }
    this.parseBirthPlace(body);

    body.qualification = this.form.getRawValue().qualification;
  }

  parseDate(body: any) {
    if (body.owner.birthday) {
      body.owner.birthday = formatDate(body.owner.birthday, 'yyyy-MM-dd', 'en');
    }
    if (body.details.end_date) {
      body.details.end_date = formatDate(body.details.end_date, 'yyyy-MM-dd', 'en');
    }
    if (body.details.start_date) {
      body.details.start_date = formatDate(body.details.start_date, 'yyyy-MM-dd', 'en');
    }
  }

  parseGeometryAddress(body: any) {
    let addresses = body.details.excavation_details.related_addresses;
    console.log('Indirizzi', addresses);
    addresses.forEach(address => {
      if (typeof address.street_name != 'string') {
        address.street_name = address.street_name.toponimo;
      }
    })
  }

  parseAddress(body: any) {
    if (typeof body.details.address != 'string') {
      body.details.address = body.details.address.toponimo;
      if (body.details.address_number != null && body.details.address_number != undefined && body.details.address_number != '') {
        body.details.address += ', ' + body.details.address_number;
      }
      delete body.details.address_number;
    }
  }

  parseIntersectionAddress(body: any) {
    if (body.details.intersection_address == null || body.details.intersection_address == undefined || body.details.intersection_address == '') {
      delete body.details.intersection_address;
    } else if (typeof body.details.intersection_address != 'string') {
      body.details.intersection_address = body.details.intersection_address.toponimo;
      if (body.details.intersection_number != null && body.details.intersection_number != undefined && body.details.intersection_number != '') {
        body.details.intersection_address += ', ' + body.details.intersection_number;
      }
      delete body.details.intersection_number;
    }
  }

  parseBirthPlace(body: any) {
    let birthplace = body.owner.birthplace;
    let county_of_birth = body.owner.county_of_birth;
    let country_of_birth = body.owner.country_of_birth;

    if (birthplace != null && birthplace != undefined && birthplace != '' && typeof birthplace != 'string') {
      body.owner.birthplace = body.owner.birthplace.code;
    }
    if (county_of_birth != null && county_of_birth != undefined && county_of_birth != '' && typeof county_of_birth != 'string') {
      body.owner.county_of_birth = body.owner.county_of_birth.code;
    }
    if (country_of_birth != null && country_of_birth != undefined && country_of_birth != '' && typeof country_of_birth != 'string') {
      body.owner.country_of_birth = body.owner.country_of_birth.code;
    }
  }

  checkValidationElseDisable(value: string, target: string) {
    if (this.form.get(value.split('/')).invalid) {
      this.form.get(target.split('/')).disable();
      this.form.get(target.split('/')).reset();
    } else {
      this.form.get(target.split('/')).enable();
      this.form.get(target.split('/')).reset();
    }
  }

  checkValidationElseEnable(value: string, target: string) {
    if (this.form.get(value.split('/')).invalid) {
      this.form.get(target.split('/')).enable();
      this.form.get(target.split('/')).reset();
    } else {
      this.form.get(target.split('/')).disable();
      this.form.get(target.split('/')).reset();
    }
  }

  onChangeCountry(value: string, target: string) {
    let value_field = this.form.get(value.split('/')).value;
    console.log(value_field);
    if (value_field != null && value_field != '' && value_field != undefined && value_field.name.toString().toUpperCase() != 'ITALIA') {
      this.form.get(target.split('/')).disable();
    } else {
      this.form.get(target.split('/')).enable();
    }
  }

  onChangeCounty(value: string, target_enable: string, target_disable: string) {
    this.loading = true;
    this.checkValidationElseDisable(value, target_enable);
    this.checkValidationElseEnable(value, target_disable);
    this.getComuni(value, target_enable);
  }

  onChangeProvince(value: string, target: string) {
    this.loading = true;
    this.checkValidationElseDisable(value, target);
    this.getComuni(value, target);
  }

  onChangeProvinceFiscalCode(value: string, target: string, data: string) {
    this.checkValidationElseDisable(value, target);
    this.getComuniAndPatch(value, target, data);
  }

  checkValidation(targets: string[]) {
    let check = false;
    targets.forEach(target => {
      if (this.form.get(target.split('/')).invalid) {
        check = true;
      }
    });
    return check;
  }

  getComuni(value: string, target: string) {
    let selectProvince = this.form.get(value.split('/')).value;
    if (selectProvince != 'EE') {
      this.apiservice.getComuni(selectProvince).subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
        this.loading = false;
      });
    } else {
      this.apiservice.getNazioni().subscribe(value => {
        this.comuni[this.toCamelCase(target)] = value['data'];
        this.loading = false;
      });
    }
  }

  getComuniAndPatch(value: string, target: string, data: string) {
    this.loading = true;
    let selectProvince = this.form.get(value.split('/')).value;
    this.apiservice.getComuni(selectProvince).subscribe(value => {
      this.comuni[this.toCamelCase(target)] = value['data'];
      let result: City = this.comuni[this.toCamelCase(target)].find((comune: City) => comune.name.toLowerCase() === data.toLowerCase());
      this.form.get(target.split('/')).patchValue(result.name);
      this.loading = false;
    });
  }

  toCamelCase(sentenceCase) {
    var out = '';
    sentenceCase.split('/').forEach((element, index) => {
      var add = element.toLowerCase();
      out += (index === 0 ? add : add[0].toUpperCase() + add.slice(1));
    });
    return out;
  }

}
