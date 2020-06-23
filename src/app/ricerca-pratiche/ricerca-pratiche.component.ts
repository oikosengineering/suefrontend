import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FilterProceduresComponent } from '../core/components/shared/filter-procedures/filter-procedures.component';
import { AuthService } from '../core/services/auth.service';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ricerca-pratiche',
  templateUrl: './ricerca-pratiche.component.html',
  styleUrls: ['./ricerca-pratiche.component.scss']
})
export class RicercaPraticheComponent implements AfterViewInit {
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'expert', 'all_mandatory_documents_uploaded', 'actions'];
  data;
  dataSource;
  isLoadingResults = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(FilterProceduresComponent) filterProcedures: FilterProceduresComponent;

  constructor(
    private auth: AuthService,
    private apiService: AppApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(queryParams => {
      let form = {};
      console.log(queryParams);
      if(queryParams){
        this.filterProcedures.patchForm(queryParams);
        form = Object.assign({}, queryParams);;
      } else {
        form = this.filterProcedures.form;
      }
      console.log(form);
      this.getResults(form);
    });
  }

  getResults(query: any){
    this.apiService.getListaPratiche('building', query).subscribe(result => {
      if(result['status'] === 200){
        this.data = result['data'];
        console.log(this.data);
        this.dataSource = new MatTableDataSource(this.data.procedures);
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.snackBar.open('Errore di sincronizzazione', null, {duration: 2000});
      }
    }, error => {
      console.log(error);
      this.isLoadingResults = false;
      this.snackBar.open('Errore di sincronizzazione', null, {duration: 2000});
    })
  }

  updateFilter(form: any){
    this.isLoadingResults = true;
    let page = 1;
    form['page'] = page;
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: this.queryParams(form),
      queryParamsHandling: 'merge'
     });
    this.getResults(form);
  }

  changePage(event: PageEvent){
    this.isLoadingResults = true;
    let page = event.pageIndex + 1;
    let form = this.filterProcedures.form;
    form['page'] = page;
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: this.queryParams(form),
      queryParamsHandling: 'merge'
    });
    this.getResults(form);
  }

  queryParams(query: any){
    let result_query = {};
    for (let key in query) {
      if (query[key] !== '' && query[key] !== undefined && query[key] !== null) {
        result_query[key] = query[key];
      }
    }
    return result_query;
  }
}