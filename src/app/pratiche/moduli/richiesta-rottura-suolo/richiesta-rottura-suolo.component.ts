import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
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
    {name: "Stradale", value: 0},
    {name: "Pavimentazione di pregio", value: 1}
  ]
  constructor(
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = new FormGroup({
      referente: new FormGroup({
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
          Validators.pattern('/(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](19|20)\d\d/')
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
      dati_pratica: new FormGroup({
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
      }),
    });
  }

  difference(form: AbstractControl, value1: string, value2: string, dest: string){
    if(form.get(value1).value === null || form.get(value1).value === '')
      return;
    if(form.get(value2).value === null || form.get(value2).value === '')
      return;
    let date1: any = new Date(form.get(value1).value);
    let date2: any = new Date(form.get(value2).value);
    form.get(dest).patchValue(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
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
}
