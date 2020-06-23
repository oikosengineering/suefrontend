import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { UploadDocumentsComponent } from '../../documents/upload-documents/upload-documents.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-extension',
  templateUrl: './view-extension.component.html',
  styleUrls: ['./view-extension.component.scss']
})
export class ViewExtensionComponent implements OnInit {

  @Input() extension: any;
  @Input() idProcedure: string;
  @Input() can_modify: boolean;

  tipologie_file = [];
  documents_uploaded = [];

  @ViewChild(UploadDocumentsComponent) uploadDocuments: UploadDocumentsComponent;

  constructor(
    private apiService: AppApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getDocumentiCaricati();
  }

  getDocumentiCaricati() {
    this.apiService.getListaDocumentiProroga('building', this.idProcedure, this.extension.id).subscribe(result => {
      this.documents_uploaded = result['data'];
    })
  }

  uploadFile(file: any) {
    this.apiService.updDocumentoProroga('building', this.idProcedure, this.extension.id, file).subscribe(result => {
      console.log(result);
      if (this.uploadDocuments) {
        this.uploadDocuments.uploadComplete();
      }
    }, error => {
      if (this.uploadDocuments) {
        this.uploadDocuments.isLoading = false;
        this.snackBar.open('Errore, impossibile caricare il file!', null, {
          duration: 2000
        });
      }
    });
  }
}
