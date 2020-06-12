import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';
import { FilterProceduresComponent } from '../core/components/shared/filter-procedures/filter-procedures.component';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements AfterViewInit{
  
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'expert', 'all_mandatory_documents_uploaded', 'actions'];
  data;
  dataSource;
  isLoadingResults = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(FilterProceduresComponent) filterProcedures: FilterProceduresComponent;

  constructor(
    private auth: AuthService,
    private apiService: AppApiService,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit() {
    this.getResults(this.filterProcedures.form);
  }

  getResults(query: any){
    query['user'] = this.auth.getIdUser();
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
    this.getResults(form);
  }
}