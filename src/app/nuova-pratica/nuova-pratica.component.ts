import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../core/services/validation.service';
import { AuthService } from '../core/services/auth.service';
import { EvtSignIn} from '../core/models/models';

@Component({
  selector: 'app-nuova-pratica',
  templateUrl: './nuova-pratica.component.html',
  styleUrls: ['./nuova-pratica.component.scss']
})
export class NuovaPraticaComponent implements OnInit {

  options = [
    { value: 0, name: "Richiesta Autorizzazione per la rottura di suolo pubblico" },
    { value: 1, name: "Richiesta Occupazione suolo a fini edili" },
    { value: 2, name: "Richiesta Rottura suolo ordinaria" },
    { value: 2, name: "Richiesta Rottura suolo urgente" },
  ];

  firstFormGroup: FormGroup;
  isUserLoggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationService,
    private auth: AuthService,
  ) {
    this.isUserLoggedIn = this.auth.isUserLoggedIn();

    auth.userislogin.subscribe(
      (data: EvtSignIn) => {
        this.isUserLoggedIn = true;
      }
    );
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      tipo_pratica: [null, Validators.required]
    });
  }

  getErrorMessage(control: AbstractControl) {
    return this.validationService.getErrorMessage(control);
  }

  getPratica() {
    let value = this.options.find(option => option.value == this.firstFormGroup.value.tipo_pratica);
    if (value) {
      return value.name;
    } else {
      return '';
    }
  }

  submit() {
    console.log("Tipo: ", this.firstFormGroup.value);
    this.router.navigate(['/pratiche', this.firstFormGroup.value.tipo_pratica, "test-pratica"]);
  }

}
