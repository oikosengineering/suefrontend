import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../../core/services/validation.service';
@Component({
  selector: 'app-richiesta-rottura-suolo',
  templateUrl: './richiesta-rottura-suolo.component.html',
  styleUrls: ['./richiesta-rottura-suolo.component.scss']
})
export class RichiestaRotturaSuoloComponent implements OnInit {
  pratica_form: FormGroup;

  // referente = {
  //       nome: <string>,
  //       cognome: <string>,
  //       cf: <string>,
  //       ragione_denominazione_sociale: <string>,
  //       luogo_nascita: <string>,
  //       sede_legale: <string>,
  //       p_iva: <number>,
  //       documento_identita: <string>,
  //       provincia_nascita: <string>,
  //       data_nascita: <string>,
  //       luogo_residenza: <string>,
  //       provincia_residenza: <string>,
  //       indirizzo_residenza: <string>,
  //       numero_residenza: <number>,
  //       cap_residenza: <number>,
  //       telefono: <number>,
  //       email: <string>
  //   },

  constructor(
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.pratica_form = new FormGroup({
      referente: new FormGroup({
        nome: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        cognome: new FormControl('', Validators.compose([Validators.required])),
        cf: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
        ])),
        ragione_denominazione_sociale: new FormControl(''),
        luogo_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        sede_legale: new FormControl(''),
        p_iva: new FormControl('', Validators.compose([
          Validators.pattern('/^[0-9]{11}$/')
        ])),
        documento_identita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        provincia_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        data_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        luogo_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        provincia_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        indirizzo_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        numero_residenza: new FormControl('', Validators.compose([
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
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]))
      }),
      tecnico: new FormGroup({
        nome: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        cognome: new FormControl('', Validators.compose([Validators.required])),
        cf: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$')
        ])),
        ragione_denominazione_sociale: new FormControl(''),
        luogo_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        sede_legale: new FormControl(''),
        p_iva: new FormControl('', Validators.compose([
          Validators.pattern('/^[0-9]{11}$/')
        ])),
        documento_identita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        provincia_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        data_nascita: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        luogo_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        provincia_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        indirizzo_residenza: new FormControl('', Validators.compose([
          Validators.required,
        ])),
        numero_residenza: new FormControl('', Validators.compose([
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
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]))
      })
    });
  }

  getErrorMessage(control: AbstractControl){
    return this.validationService.getErrorMessage(control);
  }
}
