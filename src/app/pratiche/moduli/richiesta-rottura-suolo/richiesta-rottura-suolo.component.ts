import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-richiesta-rottura-suolo',
  templateUrl: './richiesta-rottura-suolo.component.html',
  styleUrls: ['./richiesta-rottura-suolo.component.scss']
})
export class RichiestaRotturaSuoloComponent implements OnInit {
  form: FormGroup;
  tipologie = [
    {name: "Persona fisica", value: 0},
    {name: "Persona giuridica", value: 1}
  ];
  generi = [
    {name: "Maschio", value: 'm'},
    {name: "Femmina", value: 'f'}
  ];
  pavimentazioni = [
    {name: "Stradale", value: 0, price: 200, min: 2500},
    {name: "Pavimentazione di pregio", value: 1, price: 250, min: 5000}
  ];
  file_bollo = [];
  planimetria1 = [];
  planimetria2 = [];
  polizza_fidejussoria = [];

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.fb.group({
      referente: this.fb.group({
        tipo_persona: new FormControl (null, Validators.compose([
          Validators.required
        ])),
        genere: new FormControl (null, Validators.compose([
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
      }),
      // tecnico: new FormGroup({
      //   nome: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   cognome: new FormControl('', Validators.compose([Validators.required])),
      //   cf: new FormControl('', Validators.compose([
      //     Validators.required,
      //     Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
      //   ])),
      //   ragione_denominazione_sociale: new FormControl(''),
      //   luogo_nascita: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   sede_legale: new FormControl(''),
      //   p_iva: new FormControl('', Validators.compose([
      //     Validators.pattern('/^[0-9]{11}$/')
      //   ])),
      //   documento_identita: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   provincia_nascita: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   data_nascita: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   luogo_residenza: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   provincia_residenza: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   indirizzo_residenza: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   numero_residenza: new FormControl('', Validators.compose([
      //     Validators.required,
      //   ])),
      //   cap_residenza: new FormControl('', Validators.compose([
      //     Validators.required,
      //     Validators.minLength(5),
      //     Validators.maxLength(5)
      //   ])),
      //   telefono: new FormControl('', Validators.compose([
      //     Validators.required,
      //     Validators.pattern('/(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](19|20)\d\d/')
      //   ])),
      //   email: new FormControl('', Validators.compose([
      //     Validators.required,
      //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      //   ]))
      // })
      dati_pratica: this.fb.group({
        motivo: new FormControl ('', Validators.compose([
          Validators.required,
          Validators.maxLength(80)
        ])),
        descrizione: new FormControl ('', Validators.compose([
          Validators.required,
          Validators.maxLength(1000)
        ])),
        area_scavi: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        pavimentazione: new FormControl ('', Validators.compose([
          Validators.required,
        ])),
        area_cantiere: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        durata_lavori: new FormControl ('', Validators.compose([
          Validators.required,
          Validators.min(1)
        ])),
        inizio_lavori: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        fine_lavori: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        valore_polizza: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        foglio_catasto: new FormControl ('', Validators.compose([
          Validators.required
        ])),
        particella_catasto: new FormControl ('', Validators.compose([
          Validators.required
        ])),
      }),
      allegati_pratica: this.fb.group({
        marca_bollo: this.fb.group({
          codice_bollo:new FormControl ('', Validators.compose([
            Validators.required
          ])),
          file: new FormControl ('', Validators.compose([
            Validators.required
          ])),
        }),
        planimetria1: this.fb.group({
          file: new FormControl ('', Validators.compose([
            Validators.required
          ])),
        }),
        planimetria2: this.fb.group({
          file: new FormControl ('', Validators.compose([
            Validators.required
          ])),
        }),
        polizza_fidejussoria: this.fb.group({
          file: new FormControl ('', Validators.compose([
            Validators.required
          ])),
        }),
      })
    });
  }

  differenceDate(form: AbstractControl, value1: string, value2: string, dest: string){
    if(form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined)
      return;
    if(form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined)
      return;
    let date1: any = new Date(form.get(value1).value);
    let date2: any = new Date(form.get(value2).value);
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
  }

  multiplicationPolizza(form: AbstractControl, value1: string, value2: string, dest: string){
    if(form.get(value1).value === null || form.get(value1).value === '' || form.get(value2).value === undefined)
      return;
    if(form.get(value2).value === null || form.get(value2).value === '' || form.get(value2).value === undefined){
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
    if(tot >= min){
      form.get(dest).patchValue(tot);
    } else {
      form.get(dest).patchValue(min);
    }
  }

  calculateMinDate(form: AbstractControl, target: string){
    if(form.get(target).value === null || form.get(target).value === '')
      return;
    let date: any = new Date(form.get(target).value);
    return new Date(date.setDate(date.getDate() + 1));
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }

  changedTipologia(form: AbstractControl, event: MatSelectChange){
    switch(event.value){
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
        form.get('ragionesociale').setValidators([Validators.required]);
        form.get('ragionesociale').updateValueAndValidity();
        form.get('partitaiva').enable();
        form.get('partitaiva').setValidators([Validators.required]);
        form.get('partitaiva').updateValueAndValidity();
        break;
    }
  }

  check(form: AbstractControl, field: string, target: string){
    if(form.get(field).value == '' || form.get(field).value == null || form.get(field).value === undefined){
      form.get(target).setValidators(Validators.required);
      form.get(target).updateValueAndValidity();
    } else {
      form.get(target).clearValidators();
      form.get(target).updateValueAndValidity();
    }
    
  }

  uploadFile(event, form: AbstractControl, control: string){
    if(event.target.files[0]){
      this[control].push(event.target.files[0]);
      event.target.value = "";
      form.get('file').disable()
    }
  }

  removeFile(target, form: AbstractControl, control: string){
    let index = this[control].indexOf(target);
    if (index >= 0) {
      this[control].splice(index, 1);
      form.get('file').enable()
    }
  }

  submit(){
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
