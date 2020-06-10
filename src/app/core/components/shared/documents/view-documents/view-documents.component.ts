import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppApiService } from 'src/app/core/services/app-api.service';

@Component({
  selector: 'view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent implements OnInit {

  @Input() documents: any[];

  @Output() remove_document = new EventEmitter();

  constructor(
    private apiService: AppApiService
  ) { }


  ngOnInit(): void {

  }

  removeFile(id: string){
    this.remove_document.next(id);
  }

}
