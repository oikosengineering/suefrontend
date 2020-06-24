import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {

  @Input() tipologie_file;

  @Output() upload_file = new EventEmitter();

  file_to_upload;
  file_type;
  file_name;

  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    console.log("File obbligatori", this.tipologie_file);
  }

  changeType(){
    console.log(this.file_type);
  }

  changeFile(event){
    console.log(event.target.files[0])
    this.file_to_upload = event.target.files[0];
  }

  uploadFile(){
    if(this.file_to_upload){
      this.isLoading = true;
      const formData: FormData = new FormData();
      formData.append('file', this.file_to_upload, this.file_to_upload.name);
      formData.append('name', this.file_to_upload.name);
      if (this.file_type) {
        formData.append('type', this.file_type);
      }
      this.upload_file.next(formData);
    } else {
      this.file_name = '';
    }
  }

  uploadComplete(){
    this.file_name = '';
    this.file_to_upload = null;
    this.isLoading = false;
  }

}
