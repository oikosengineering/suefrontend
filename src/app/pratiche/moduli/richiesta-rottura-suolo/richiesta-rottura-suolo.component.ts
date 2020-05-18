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
    { name: "Persona fisica", value: 0 },
    { name: "Persona giuridica", value: 1 }
  ];
  generi = [
    { name: "Maschio", value: 'm' },
    { name: "Femmina", value: 'f' }
  ];
  pavimentazioni = [
    { name: "Stradale", value: 0, price: 200, min: 2500 },
    { name: "Pavimentazione di pregio", value: 1, price: 250, min: 5000 }
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
      delegato: new FormControl(''),
      referente: this.createPersona(),
      tecnico: this.createPersona(),
      dati_pratica: this.createDatiPratica(),
      esecutore_lavori: new FormControl('business', Validators.compose([
        Validators.required
      ])),
      ditta_lavori: this.createDitta(),
      qualifica: new FormControl('owner', Validators.compose([
        Validators.required
      ])),
      amministratore: this.createEsperto(),
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

  get formReferente() { return this.form.get('referente'); }
  get formTecnico() { return this.form.get('tecnico'); }
  get formDittaLavori() { return this.form.get('ditta_lavori'); }
  get formDatiPratica() { return this.form.get('dati_pratica'); }
  get formContattiDitta() { return <FormArray>this.form.get('ditta_lavori').get('contatti'); }
  get formContattiTecnico() { return <FormArray>this.form.get('tecnico').get('contatti'); }
  get formContattiReferente() { return <FormArray>this.form.get('referente').get('contatti'); }

  createDatiPratica(): FormGroup {
    return this.fb.group({
      motivo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(80)
      ])),
      descrizione: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(1000)
      ])),
      area_scavi: new FormControl('', Validators.compose([
        Validators.required
      ])),
      geometria_scavi: new FormControl([], Validators.compose([
        Validators.required
      ])),
      pavimentazione: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      area_cantiere: new FormControl('', Validators.compose([
        Validators.required
      ])),
      geometria_cantiere: new FormControl([], Validators.compose([
        Validators.required
      ])),
      durata_lavori: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
      inizio_lavori: new FormControl('', Validators.compose([
        Validators.required
      ])),
      fine_lavori: new FormControl('', Validators.compose([
        Validators.required
      ])),
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
  createPersona(): FormGroup {
    return this.fb.group({
      tipo_persona: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      genere: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      nome: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cognome: new FormControl('', Validators.compose([Validators.required])),
      codicefiscale: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      ])),
      ragionesociale: new FormControl(''),
      nascita_comune: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nascita_provincia: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nascita_stato: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nascita_data: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      partitaiva: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      comune_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      provincia_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      indirizzo_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      civico_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cap_residenza: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),
      contatti: this.fb.array([]),
      telefono: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cellulare: new FormControl('', Validators.compose([
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
  createEsperto(): FormGroup {
    return this.fb.group({
      genere: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      nome: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cognome: new FormControl('', Validators.compose([Validators.required])),
      codicefiscale: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      ])),
      titolo_professionale: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      partitaiva: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      comune_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      provincia_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      indirizzo_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      civico_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cap_residenza: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      pec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]))
    });
  }
  createDitta(): FormGroup {
    return this.fb.group({
      ragionesociale: new FormControl(''),
      partitaiva: new FormControl('', Validators.compose([
        Validators.pattern('/^[0-9]{11}$/')
      ])),
      comune_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      provincia_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      indirizzo_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      civico_residenza: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cap_residenza: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),
      contatti: this.fb.array([]),
      telefono: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cellulare: new FormControl('', Validators.compose([
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

  createContatto(): FormGroup{
    return this.fb.group({
      tipo: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nome: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      telefono: new FormControl('', Validators.compose([
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

  removeContatto(array: AbstractControl, index: number){
    event.preventDefault();
    event.stopPropagation();
    let items = array as FormArray;
    items.removeAt(index);
  }

  checkState(){
    if(!this.form.get('delegato').value){
      this.form.get('tecnico').disable();
      this.form.get('tecnico').updateValueAndValidity();
    }
    if(this.form.get('qualifica').value == 'owner'){
      this.form.get('amministratore').disable();
      this.form.get('amministratore').updateValueAndValidity();
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
    if (form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined)
      return;
    if (form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined) {
      return;
    } else {
      let min = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2).value).min;
      form.get(dest).clearValidators();
      form.get(dest).setValidators(Validators.min(min));
      form.get(dest).updateValueAndValidity();
    }
    let pavimentazione = this.pavimentazioni.find(pavimentazione => pavimentazione.value == form.get(value2).value);
    let price = pavimentazione.price;
    let min = pavimentazione.min;
    let tot = Math.floor(price * form.get(value1).value);
    if (tot >= min) {
      form.get(dest).patchValue(tot);
    } else {
      form.get(dest).patchValue(min);
    }
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

  changedTipologia(form: AbstractControl, event: MatSelectChange) {
    switch (event.value) {
      case 0:
        form.get('nome').enable()
        form.get('cognome').enable();
        form.get('codicefiscale').enable();
        form.get('genere').enable();
        form.get('nascita_comune').enable();
        form.get('nascita_provincia').enable();
        form.get('nascita_stato').enable();
        form.get('nascita_data').enable();
        form.get('nascita_provincia').enable();
        form.get('contatti').disable();
        form.get('ragionesociale').clearValidators();
        form.get('ragionesociale').updateValueAndValidity();
        form.get('partitaiva').clearValidators();
        form.get('partitaiva').updateValueAndValidity();
        break;
      case 1:
        form.get('nome').disable()
        form.get('cognome').disable();
        form.get('codicefiscale').disable();
        form.get('genere').disable();
        form.get('nascita_comune').disable();
        form.get('nascita_provincia').disable();
        form.get('nascita_stato').disable();
        form.get('nascita_data').disable();
        form.get('nascita_provincia').disable();
        form.get('ragionesociale').enable();
        form.get('contatti').enable();
        form.get('ragionesociale').setValidators([Validators.required]);
        form.get('ragionesociale').updateValueAndValidity();
        form.get('partitaiva').enable();
        form.get('partitaiva').setValidators([Validators.required]);
        form.get('partitaiva').updateValueAndValidity();
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
  
  changeDelegato(event: MatCheckboxChange, control: AbstractControl){
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

  changeQualifica(event: MatRadioChange, control: AbstractControl){
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
        features: this.form.get('dati_pratica').get('geometria_scavi').value
      },
      {
        type: 'cantiere',
        features: this.form.get('dati_pratica').get('geometria_cantiere').value
      }
    ]
    this.map_cfg.features = features;
    this.dialog.openMap(this.map_cfg, ).subscribe(value => {
      if (value) {
        this.map_cfg.features = value;
        value.forEach(feature => {
          switch(feature.type){
            case 'scavo':
              this.form.get('dati_pratica').get('geometria_scavi').patchValue(feature.features);
              this.form.get('dati_pratica').get('area_scavi').patchValue(feature.area);
              break;
            case 'cantiere':
              this.form.get('dati_pratica').get('geometria_cantiere').patchValue(feature.features);
              this.form.get('dati_pratica').get('area_cantiere').patchValue(feature.area);
          }
        });
        console.log("Dati pratica",this.form.get('dati_pratica').value);
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
