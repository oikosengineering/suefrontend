import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mie-pratiche',
  templateUrl: './mie-pratiche.component.html',
  styleUrls: ['./mie-pratiche.component.scss']
})
export class MiePraticheComponent implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['number', 'protocol', 'status', 'category', 'referrer'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}

const ELEMENT_DATA = [
  {number: 1, protocol: 'A01', status: 'NEW', category: 'rottura_suolo', referrer: {first_name: 'Mihail', last_name: 'Timofei'}},
  {number: 2, protocol: 'A02', status: 'PROCESSED', category: 'rottura_suolo', referrer: {name:"Gomma S.r.l"}},
];
