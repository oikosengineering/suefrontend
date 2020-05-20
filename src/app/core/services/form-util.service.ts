import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { fiscalCodeValidator } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class FormUtilService {

  constructor(
    private fb: FormBuilder,
  ) { }

  createDetailsRotturaSuolo(): FormGroup {
    return this.fb.group({
      reason: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(80)
      ])),
      description: this.createDescriptionRotturaSuolo(),
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

  createDescriptionRotturaSuolo(): FormGroup{
    return this.fb.group({
      laying_type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      diameter: new FormControl('', Validators.compose([
        Validators.required
      ])),
      length: new FormControl('', Validators.compose([
        Validators.required
      ])),
      motive: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(80)
      ])),
      notes: new FormControl('', Validators.compose([
        Validators.maxLength(1000)
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
        Validators.pattern('^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$'),
        fiscalCodeValidator()
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
  createExpert(): FormGroup {
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
  createBusiness(): FormGroup {
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

  createContact(): FormGroup{
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
}
