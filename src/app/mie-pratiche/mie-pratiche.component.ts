import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppApiService } from '../core/services/app-api.service';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements OnInit {
  // data = {
  //   procedures:[
  //     {number: 1, protocol: 'A01', status: 'NEW', category: 'rottura_suolo', referrer: {first_name: 'Mihail', last_name: 'Timofei'}, experts:[{name: 'Oikos'}], all_mandatory_documents_uploaded: true},
  //     {number: 2, protocol: 'A02', status: 'APPROVED', category: 'rottura_suolo', referrer: {name:"Gomma S.r.l"}, experts:[{first_name: 'Mihail', last_name: 'Timofei'}], all_mandatory_documents_uploaded: false},
  //   ],
  //   meta:{
  //     pagination:{
  //       total: 10,
  //       count: 2,
  //       per_page: 5,
  //       current_page: 2,
  //       total_pages: 1,
  //       links: ''
  //     }
  //   }
  // }
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'owner', 'expert', 'all_mandatory_documents_uploaded', 'actions'];
  // dataSource = new MatTableDataSource(this.data.procedures);
  data;
  dataSource;
  isLoadingResults = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private apiService: AppApiService
  ) { }
  

  ngOnInit() {
    this.apiService.getListaPratiche('building', '5d4c3a51-a978-4acd-a757-520145b6268f').subscribe(result => {
      if(result['status'].status === 200){
        this.data = result['data'];
        console.log(this.data);
        this.dataSource = new MatTableDataSource(this.data.procedures);
        this.isLoadingResults = false;
      }
    })
    // this.dataSource.paginator = this.paginator;
  }
}