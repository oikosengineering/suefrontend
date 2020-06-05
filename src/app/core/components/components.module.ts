import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { MapComponent } from './map/map.component';
import { MaterialModule } from '../module/material/material.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { DocumentsUploadedComponent } from './shared/documents-uploaded/documents-uploaded.component';
import { DocumentsUploadedPipe } from '../pipes/documents-uploaded.pipe';
import { StatusProceduresComponent } from './shared/status-procedures/status-procedures.component';
import { StatusPipe } from '../pipes/status.pipe';


@NgModule({
  declarations: [MyDialogComponent, MapComponent, DocumentsUploadedComponent, StatusProceduresComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule
  ],
  entryComponents: [MyDialogComponent, MapComponent],
  exports: [MyDialogComponent, MapComponent, DocumentsUploadedComponent, StatusProceduresComponent],
  providers: [DocumentsUploadedPipe, StatusPipe]
})
export class ComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
