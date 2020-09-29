import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';
import { FilterProceduresComponent } from '../core/components/shared/filter-procedures/filter-procedures.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements AfterViewInit{
  
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'creator', 'all_mandatory_documents_uploaded', 'actions'];
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
  ) { }

  ngAfterViewInit() {
    let queryParams = this.route.snapshot.queryParams;
    let form = {};
    if(queryParams){
      this.filterProcedures.patchForm(queryParams);
      form = Object.assign({}, queryParams);;
    } else {
      form = this.filterProcedures.form;
    }
    this.getResults(form);
  }

  getResults(query: any){
    query['user'] = this.auth.getIdUser();
    this.apiService.getListaPratiche('building', query, '').subscribe(result => {
      if(result['status'] === 200){
        if (result['data'] != null)  {
          this.data = result['data'];
          this.dataSource = new MatTableDataSource(this.data.procedures);
        } else { 
          this.data = [];
          this.dataSource = [];
        }
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.snackBar.open('Errore di sincronizzazione', null, {duration: 2000});
      }
    }, error => {
      this.isLoadingResults = false;
      this.snackBar.open('Errore di sincronizzazione', null, {duration: 2000});
    });
  }

  updateFilter(form: any){
    this.isLoadingResults = true;
    let page = 1;
    form['page'] = page;
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: this.queryParams(form)
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
      queryParams: this.queryParams(form)
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