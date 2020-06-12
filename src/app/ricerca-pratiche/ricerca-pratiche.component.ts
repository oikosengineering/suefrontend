import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FilterProceduresComponent } from '../core/components/shared/filter-procedures/filter-procedures.component';
import { AuthService } from '../core/services/auth.service';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


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
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit() {
    this.getResults(this.filterProcedures.form);
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
    this.getResults(form);
  }
}