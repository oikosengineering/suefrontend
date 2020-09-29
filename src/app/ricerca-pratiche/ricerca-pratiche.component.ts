import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FilterProceduresComponent } from '../core/components/shared/filter-procedures/filter-procedures.component';
import { AuthService } from '../core/services/auth.service';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';

@Component({
  selector: 'app-ricerca-pratiche',
  templateUrl: './ricerca-pratiche.component.html',
  styleUrls: ['./ricerca-pratiche.component.scss']
})
export class RicercaPraticheComponent implements AfterViewInit {
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'creator', /* 'all_mandatory_documents_uploaded', */ 'actions'];
  data;
  dataSource;
  isLoadingResults = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(FilterProceduresComponent) filterProcedures: FilterProceduresComponent;
  isUserLoggedIn = false;

  map_cfg = {
    buttons: [
    ],
    layers: [
      {
        name: "Civici",
        style: "style_scavo",
        id: 'civici'
      }
    ],
    features: [
      {
        type: 'civici',
        features: []
      }
    ]
  };

  constructor(
    private auth: AuthService,
    private apiService: AppApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: DialogMessageService,
  ) {
    this.isUserLoggedIn = this.auth.isUserLoggedIn();
  }

  ngAfterViewInit() {

    if (this.router.url.includes('ricerca-pratiche')) { this.route.snapshot.queryParams = { 'status': 'APPROVED' }; }
    let queryParams = this.route.snapshot.queryParams;
    let form = {};
    if (queryParams) {
      this.filterProcedures.patchForm(queryParams);
      form = Object.assign({}, queryParams);
    } else {
      form = this.filterProcedures.form;
    }
    console.log(form);
    this.getResults(form);
  }

  getResults(query: any) {
    this.apiService.getListaPratichePubbliche('building', query, 'public').subscribe(result => {
      if (result['status'] === 200) {
        if (result['data'] != null) {
          this.data = result['data'];
          this.dataSource = new MatTableDataSource(this.data.procedures);
        } else {
          this.data = [];
          this.dataSource = [];
        }
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.snackBar.open('Errore di sincronizzazione', null, { duration: 2000 });
      }
    }, error => {
      this.isLoadingResults = false;
      this.snackBar.open('Errore di sincronizzazione', null, { duration: 2000 });
    });
  }

  updateFilter(form: any) {
    this.isLoadingResults = true;
    let page = 1;
    form['page'] = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams(form)
    });
    this.getResults(form);
  }

  changePage(event: PageEvent) {
    this.isLoadingResults = true;
    let page = event.pageIndex + 1;
    let form = this.filterProcedures.form;
    form['page'] = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams(form)
    });
    this.getResults(form);
  }

  queryParams(query: any) {
    let result_query = {};
    for (let key in query) {
      if (query[key] !== '' && query[key] !== undefined && query[key] !== null) {
        result_query[key] = query[key];
      }
    }
    return result_query;
  }

  openMap(element: any) {
    event.preventDefault();
    event.stopPropagation();
    let features = [
      {
        type: 'civici',
        features: []
      }
    ];

    if (element !== null && element !== undefined) {
      let indirizzo = '';
      if (element.category !== 'rottura_suolo') indirizzo = element.details.address;
      if (element.category === 'rottura_suolo' ) indirizzo = element.details.excavation_details[0].street_name + ' , ' +  element.details.excavation_details[0].from_street_number;

      this.apiService.getCoordFromIndirizzo(indirizzo).subscribe((result) => {
        if (result['data'] !== null && result['data'] !== undefined) {
          this.map_cfg.features = features;
          this.dialog.openMap(this.map_cfg).subscribe(value => {
            if (value) {
              this.map_cfg.features = value;
              value.forEach(feature => {
                switch (feature.type) {
                  case 'civici':
                    break;
                }
              });
            }
            console.log('Mappa chiusa', value);
          }, error => {
            console.log('errore mappa');
          });
        }
      });
    }
  }
}
