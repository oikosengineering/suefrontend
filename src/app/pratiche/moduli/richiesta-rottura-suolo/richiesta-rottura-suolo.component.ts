import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { BrowserStack } from 'protractor/built/driverProviders';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-richiesta-rottura-suolo',
  templateUrl: './richiesta-rottura-suolo.component.html',
  styleUrls: ['./richiesta-rottura-suolo.component.scss']
})
export class RichiestaRotturaSuoloComponent implements OnInit {
  form: FormGroup;
  tipologie = [
    { name: "Persona fisica", value: 'person' },
    { name: "Persona giuridica", value: 'business' }
  ];
  generi = [
    { name: "Maschio", value: 'M' },
    { name: "Femmina", value: 'F' }
  ];
  pavimentazioni = [
    { name: "Stradale", value: 'standard', price: 200, min: 2500 },
    { name: "Pavimentazione di pregio", value: 'high-quality', price: 250, min: 5000 }
  ];
  esecutori = [
    {name: "In proprio", value: 'self'},
    {name: "Ditta", value: 'business'}
  ]
  tipologie_contatto = [
    {name: "Amministrativo", value: "administrative"},
    {name: "Tecnico", value: "technical"},
    {name: "Contabilità", value: "accounting"},
    {name: "Altro", value: "other"}
  ]
  qualifiche = [
    {name: "Proprietario", value:"owner"},
    {name: "Rappresentante della compagnia", value:"company_representative"},
    {name: "Amministratore", value:"property_manager"}
  ]
  tipi_documento = [
    {name: "Carta d'identità", value: "d_card"},
    {name: "Passaporto", value: "passport"},
    {name: "Patente", value: "driving_license"}
  ]
  titoli_professionali = [
    "architetto",
    "avvocato",
    "cavaliere",
    "commendatore",
    "dottore",
    "dottoressa",
    "generale",
    "geometra",
    "ingegnere",
    "monsignore",
    "onorevole",
    "professore",
    "professoressa",
    "ragioniere",
    "reverendo",
    "senatore",
    "tenente",
    "ufficiale"
  ]

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

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dialog: DialogMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      delegated: new FormControl(false),
      owner: this.createOwner(),
      // expert: this.createExpertBusiness(),
      experts: this.fb.array([this.createExpertBusiness()]),
      details: this.createDatiPratica(),
      work_supplier: new FormControl('self', Validators.compose([
        Validators.required
      ])),
      supplier_business: this.createDitta(),
      qualification: new FormControl('owner', Validators.compose([
        Validators.required
      ])),
      business_administrator: this.createEsperto(),
      allegati_pratica: this.fb.group({
        marca_bollo: this.fb.group({
          codice_bollo: new FormControl('', Validators.compose([
            Validators.required
          ])),
          file: new FormControl('', Validators.compose([
            Validators.required
          ])),
        }),
        planimetria1: this.fb.group({
          file: new FormControl('', Validators.compose([
            Validators.required
          ])),
        }),
        planimetria2: this.fb.group({
          file: new FormControl('', Validators.compose([
            Validators.required
          ])),
        }),
        polizza_fidejussoria: this.fb.group({
          file: new FormControl('', Validators.compose([
            Validators.required
          ])),
        }),
      })
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
  createDatiPratica(): FormGroup {
    return this.fb.group({
      reason: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(80)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(1000)
      ])),
      excavation_details: this.createGeometryDetails(),
      building_site: this.createGeometryDetails(),
      flooring_type: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      duration: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      insurance: this.createInsurance(),
      valore_polizza: new FormControl('', Validators.compose([
        Validators.required
      ])),
      foglio_catasto: new FormControl('', Validators.compose([
        Validators.required
      ])),
      particella_catasto: new FormControl('', Validators.compose([
        Validators.required
      ])),
    })
  }

  createInsurance(): FormGroup{
    return this.fb.group({
      surety: new FormControl(false, Validators.compose([
        Validators.pattern('true')
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.required
      ])),
    })
  }

  createGeometryDetails(): FormGroup{
    return this.fb.group({
      area_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      geometry: new FormControl([], Validators.compose([
        Validators.required
      ])),
    })
  }

  createOwner(): FormGroup {
    return this.fb.group({
      type: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      gender: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      first_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      last_name: new FormControl('', Validators.compose([Validators.required])),
      fiscal_code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      ])),
      document_type: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      document_number: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      name: new FormControl(''),
      birthplace: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      county_of_birth: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      birthday: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      vat: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      address: this.createAddress(),
      contacts: this.fb.array([]),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cellular: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      pec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]))
    });
  }
  createExpertBusiness(): FormGroup{
    return this.fb.group({
      type: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      gender: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      first_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      last_name: new FormControl('', Validators.compose([Validators.required])),
      fiscal_code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      ])),
      professional_title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      vat: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      name: new FormControl(''),
      contacts: this.fb.array([]),
      address: this.createAddress(),
      cellular: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      pec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
    });
  }
  createEsperto(): FormGroup {
    return this.fb.group({
      gender: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      first_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      last_name: new FormControl('', Validators.compose([Validators.required])),
      fiscal_code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      ])),
      professional_title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      vat: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      address: this.createAddress(),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      pec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
    });
  }
  createDitta(): FormGroup {
    return this.fb.group({
      name: new FormControl(''),
      vat: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      address: this.createAddress(),
      contacts: this.fb.array([]),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]))
    });
  }

  createAddress(): FormGroup{
    return this.fb.group({
      city: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      county: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      street_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      postcode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),
    })
  }

  createContatto(): FormGroup{
    return this.fb.group({
      type: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    })
  }

  addContatto(array: AbstractControl): void {
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.push(this.createContatto());
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
    items.push(this.createExpertBusiness());
  }

  checkState(){
    if(!this.form.get('delegated').value){
      this.form.get('experts').disable();
      this.form.get('experts').updateValueAndValidity();
    }
    if(this.form.get('qualification').value == 'owner'){
      this.form.get('business_administrator').disable();
      this.form.get('business_administrator').updateValueAndValidity();
    }
    if(this.form.get('work_supplier').value == 'self'){
      this.form.get('supplier_business').disable();
      this.form.get('supplier_business').updateValueAndValidity();
    }
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
        form.get('name').clearValidators();
        form.get('name').updateValueAndValidity();
        form.get('vat').clearValidators();
        form.get('vat').updateValueAndValidity();
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
        form.get('name').setValidators([Validators.required]);
        form.get('name').updateValueAndValidity();
        form.get('vat').enable();
        form.get('vat').setValidators([Validators.required]);
        form.get('vat').updateValueAndValidity();
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
        form.get('contacts').disable();
        form.get('name').clearValidators();
        form.get('name').updateValueAndValidity();
        form.get('vat').clearValidators();
        form.get('vat').updateValueAndValidity();
        break;
      case 'business':
        form.get('first_name').disable()
        form.get('last_name').disable();
        form.get('fiscal_code').disable();
        form.get('gender').disable();
        form.get('name').enable();
        form.get('contacts').enable();
        form.get('name').setValidators([Validators.required]);
        form.get('name').updateValueAndValidity();
        form.get('vat').enable();
        form.get('vat').setValidators([Validators.required]);
        form.get('vat').updateValueAndValidity();
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
      console.log('errore mappa')
    });
  }

  submit() {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      console.log(this.form.getRawValue());
    } else {
      this.validationService.validateAllFormFields(this.form);
      console.log(this.form.getRawValue());
    }
  }
}
