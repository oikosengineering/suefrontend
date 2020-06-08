import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-experts',
  templateUrl: './view-experts.component.html',
  styleUrls: ['./view-experts.component.scss']
})
export class ViewExpertsComponent implements OnInit {

  @Input() experts: any[];
  @Input() tipologie: any[];
  @Input() generi: any[];
  @Input() tipologie_contatto: any[];
  @Input() titoli_professionali: any[];
  @Input() province: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
