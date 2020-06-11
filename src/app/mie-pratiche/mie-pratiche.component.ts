import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppApiService } from '../core/services/app-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements OnInit {
  
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'expert', 'all_mandatory_documents_uploaded', 'actions'];
  data;
  dataSource;
  isLoadingResults = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private apiService: AppApiService,
    private snackBar: MatSnackBar
  ) { }
  

  ngOnInit() {
    this.apiService.getListaPratiche('building', '5d4c3a51-a978-4acd-a757-520145b6268f').subscribe(result => {
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
}