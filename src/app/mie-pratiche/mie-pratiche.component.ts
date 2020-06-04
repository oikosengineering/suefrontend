import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements OnInit {
  data = {
    procedures:[
      {number: 1, protocol: 'A01', status: 'NEW', category: 'rottura_suolo', referrer: {first_name: 'Mihail', last_name: 'Timofei'}, all_mandatory_documents_uploaded: true},
      {number: 2, protocol: 'A02', status: 'APPROVED', category: 'rottura_suolo', referrer: {name:"Gomma S.r.l"}, all_mandatory_documents_uploaded: false},
    ],
    meta:{
      pagination:{
        total: 10,
        count: 2,
        per_page: 5,
        current_page: 2,
        total_pages: 1,
        links: ''
      }
    }
  }
  constructor() { }
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'referrer', 'all_mandatory_documents_uploaded', 'actions'];
  dataSource = new MatTableDataSource(this.data.procedures);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }
}