import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
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
      ])),
      description: this.createDescriptionRotturaSuolo(),
      excavation_details: this.createGeometryDetailsAddress(),
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
    });
  }

  createDetailsOccupazioneSuoloEdilizio(): FormGroup {
    return this.fb.group({
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address_number: new FormControl(''),
      intersection_address: new FormControl(''),
      intersection_number: new FormControl(''),
      scaffolding: this.createBuildingSize(),
      building_site: this.createBuildingSize(),
      other: this.createBuildingSizeDescription(),
      total_duration: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      affected_area: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  createDetailsOccupazioneAreePubbliche(): FormGroup {
    return this.fb.group({
      type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address_number: new FormControl(''),
      length: new FormControl('', Validators.compose([
        Validators.required
      ])),
      width: new FormControl('', Validators.compose([
        Validators.required
      ])),
      total_square_meters: new FormControl('', Validators.compose([
        Validators.required
      ])),
      tables: new FormControl(false),
      chairs: new FormControl(false),
      umbrellas: new FormControl(false),
      footboard: new FormControl(false),
      other: new FormControl(false),
      other_description: new FormControl({value: '', disabled: true}),
      total_duration: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      affected_area: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  createDetailsOccupazioneSuoloPubblicoTraslochiLavori(): FormGroup {
    return this.fb.group({
      reason: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address_number: new FormControl(''),
      length: new FormControl('', Validators.compose([
        Validators.required
      ])),
      width: new FormControl('', Validators.compose([
        Validators.required
      ])),
      square_meters: new FormControl('', Validators.compose([
        Validators.required
      ])),
      total_duration: new FormControl('', Validators.compose([
        Validators.required
      ])),
      start_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      start_time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      end_time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      through: new FormControl('', Validators.compose([
        Validators.required
      ])),
      through_details: new FormControl('', Validators.compose([
        Validators.required
      ])),
      affected_area: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  createBuildingSize(): FormGroup {
    return this.fb.group({
      length: new FormControl('', Validators.compose([
        Validators.required
      ])),
      width: new FormControl('', Validators.compose([
        Validators.required
      ])),
      total_square_meters: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  createBuildingSizeDescription(): FormGroup {
    return this.fb.group({
      length: new FormControl('', Validators.compose([
        Validators.required
      ])),
      width: new FormControl('', Validators.compose([
        Validators.required
      ])),
      total_square_meters: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('')
    }, {disabled: true});
  }

  createInsurance(): FormGroup{
    return this.fb.group({
      surety: new FormControl(false, Validators.compose([
        Validators.pattern('true')
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
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
      notes: new FormControl(''),
    });
  }

  createGeometryDetails(): FormGroup{
    return this.fb.group({
      area_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      geometry: new FormControl('', Validators.compose([
        Validators.required
      ])),
    })
  }

  createGeometryDetailsAddress(): FormGroup{
    return this.fb.group({
      area_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      geometry: new FormControl('', Validators.compose([
        Validators.required
      ])),
      related_addresses: this.fb.array([this.geometryAddress()])
    });
  }

  geometryAddress(): FormGroup{
    return this.fb.group({
      street_name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      from_street_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
      to_street_number: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
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
      birthplace: new FormControl({value: '', disabled: true}, Validators.compose([
        Validators.required,
      ])),
      county_of_birth: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      country_of_birth: new FormControl(''),
      birthday: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      vat: new FormControl('', Validators.compose([
        Validators.maxLength(11),
        Validators.minLength(11),
      ])),
      address: this.createAddress(),
      contacts: this.fb.array([]),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([\+]39)[0|3]\d{2}\d{6,7}')
      ])),
      // cellular: new FormControl('', Validators.compose([
      //   Validators.required,
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
      ])),
      // pec: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      // ]))
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
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
      ])),
      name: new FormControl(''),
      contacts: this.fb.array([]),
      address: this.createAddress(),
      // cellular: new FormControl('', Validators.compose([
      //   Validators.required,
      // ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([\+]39)[0|3]\d{2}\d{6,7}')
      ])),
      // pec: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
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
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
      ])),
      address: this.createAddress(),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([\+]39)[0|3]\d{2}\d{6,7}')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
      ])),
    });
  }
  
  createBusiness(): FormGroup {
    return this.fb.group({
      name: new FormControl(''),
      vat: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
      ])),
      address: this.createAddress(),
      contacts: this.fb.array([]),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([\+]39)[0|3]\d{2}\d{6,7}')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
      ]))
    });
  }

  createAddress(): FormGroup{
    return this.fb.group({
      city: new FormControl({value: '', disabled: true}, Validators.compose([
        Validators.required,
      ])),
      county: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      country: new FormControl(''),
      street_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      postcode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ])),
    });
  }

  createContact(): FormGroup{
    return this.fb.group({
      type: new FormControl('', Validators.compose([
        Validators.required
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.pattern('(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))'),
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([\+]39)[0|3]\d{2}\d{6,7}')
      ])),
    });
  }

  createExtension(): FormGroup{
    return this.fb.group({
      end_date: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  createFilter(): FormGroup{
    return this.fb.group({
      protocol: new FormControl(''),
      year: new FormControl(''),
      category: new FormControl(''),
      status: new FormControl(''),
      referrer_name: new FormControl(''),
      referrer_surname: new FormControl(''),
      created_at_since: new FormControl(''),
      created_at_until: new FormControl(''),
    });
  }

  createDocumenti(): FormGroup{
    return this.fb.group({
      type: new FormControl('', Validators.compose([
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }
}
