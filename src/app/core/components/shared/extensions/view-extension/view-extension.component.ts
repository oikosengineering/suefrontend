import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppApiService } from 'src/app/core/services/app-api.service';
import { UploadDocumentsComponent } from '../../documents/upload-documents/upload-documents.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewDocumentsComponent } from '../../documents/view-documents/view-documents.component';

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

  isLoading = false;

  @ViewChild(UploadDocumentsComponent) uploadDocuments: UploadDocumentsComponent;

  constructor(
    private apiService: AppApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getDocumentiCaricati();
  }

  getDocumentiCaricati() {
    this.isLoading = true;
    this.apiService.getListaDocumentiProroga('building', this.idProcedure, this.extension.id).subscribe(result => {
      this.documents_uploaded = result['data'];
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  uploadFile(file: any) {
    this.apiService.updDocumentoProroga('building', this.idProcedure, this.extension.id, file).subscribe(result => {
      if (this.uploadDocuments) {
        this.uploadDocuments.uploadComplete();
      }
      this.getDocumentiCaricati();
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
