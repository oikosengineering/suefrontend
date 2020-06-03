import { Component, OnInit, Input } from '@angular/core';
import { DocumentsUploadedPipe } from 'src/app/core/pipes/documents-uploaded.pipe';

@Component({
  selector: 'documents-uploaded',
  templateUrl: './documents-uploaded.component.html',
  styleUrls: ['./documents-uploaded.component.scss']
})
export class DocumentsUploadedComponent implements OnInit {
  @Input() doucuments_uploaded: boolean;
  status;
  constructor(
    private pipe: DocumentsUploadedPipe
  ) { }

  ngOnInit(): void {
    this.status = this.pipe.transform(this.doucuments_uploaded);
  }

}
