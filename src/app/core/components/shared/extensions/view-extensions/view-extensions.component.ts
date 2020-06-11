import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-extensions',
  templateUrl: './view-extensions.component.html',
  styleUrls: ['./view-extensions.component.scss']
})
export class ViewExtensionsComponent implements OnInit {

  @Input() extensions: any[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
