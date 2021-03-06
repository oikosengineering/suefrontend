import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsUploadedPipe } from './documents-uploaded.pipe';
import { CategoryPipe } from './category.pipe';
import { StatusPipe } from './status.pipe';
import { DelegatedPipe } from './delegated.pipe';
import { CanExtendedPipe } from './can-extended.pipe';
import { ExpertPipe } from './expert.pipe';
import { CanUploadPipe } from './can-upload.pipe';
import { FileExtensionsPipe } from './file-extensions.pipe';
import { ProcedureTypePipe } from './procedure-type.pipe';



@NgModule({
  declarations: [
    DocumentsUploadedPipe,
    CategoryPipe,
    StatusPipe,
    DelegatedPipe,
    CanExtendedPipe,
    ExpertPipe,
    CanUploadPipe,
    FileExtensionsPipe,
    ProcedureTypePipe
  ],
  exports:[
    DocumentsUploadedPipe,
    CategoryPipe,
    StatusPipe,
    DelegatedPipe,
    CanExtendedPipe,
    ExpertPipe,
    CanUploadPipe,
    FileExtensionsPipe,
    ProcedureTypePipe
  ],
  providers:[
    CanUploadPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
