import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'filter-procedures',
  templateUrl: './filter-procedures.component.html',
  styleUrls: ['./filter-procedures.component.scss']
})
export class FilterProceduresComponent implements OnInit {

  filter: FormGroup;

  years = [];
  categories = [];
  statuses = [];

  @Output() update_filter = new EventEmitter();

  isLoading = false;
  isUserLoggedIn = false;

  myProcedures: boolean;

  constructor(
    private apiService: AppApiService,
    private formService: FormUtilService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isUserLoggedIn = this.authService.isUserLoggedIn();
    this.myProcedures = this.router.url.includes('mie-pratiche');
  }

  ngOnInit(): void {
    console.log(this.statuses);
    console.log(this.router.url);
    this.isUserLoggedIn = this.authService.isUserLoggedIn();
    this.getVariables();
    this.setYears();
    this.filter = this.formService.createFilter();
  }

  get form() { return this.filter.value };

  getVariables() {
    this.isLoading = true;
    let promises = [];
    promises.push(this.getCategories());
    promises.push(this.getStatuses());
    Promise.all(promises).then(result => {
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
    })
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('procedure.category').subscribe(data => {
        this.categories = data['data'];
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  getStatuses() {
    return new Promise((resolve, reject) => {
      this.apiService.getDizionario('procedure.status').subscribe(data => {
        this.statuses = this.myProcedures ? data['data'] : data['data'].filter(value => value['value'] === 'APPROVED');
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  setYears() {
    this.years = [];
    let min = 1900;
    let date = new Date();
    let year = date.getFullYear();
    for (let i = year; i >= min; i--) {
      this.years.push(i);
    }
  }

  reset() {
    this.filter.reset();
    if(!this.myProcedures){
      this.filter.patchValue({
        status: 'APPROVED'
      })
    }
  }

  submit() {
    let result = this.filter.value;
    this.parseFilter(result);
    this.update_filter.next(result);
  }

  patchForm(data: any) {
    this.filter.patchValue(data);
    this.patchDate(data);
  }

  patchDate(data) {
    if (data.created_at_since) {
      this.filter.get('created_at_since').patchValue(new Date(data.created_at_since * 1000));
    }
    if (data.created_at_until) {
      this.filter.get('created_at_until').patchValue(new Date(data.created_at_until * 1000));
    }
  }

  parseFilter(body: any) {
    if (body.created_at_since) {
      body.created_at_since = new Date(body.created_at_since).getTime() / 1000;
    }
    if (body.created_at_until) {
      body.created_at_until = new Date(body.created_at_until).getTime() / 1000;
    }
  }
}
