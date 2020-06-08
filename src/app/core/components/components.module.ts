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
import { ViewOwnerComponent } from './shared/view-owner/view-owner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewExpertsComponent } from './shared/view-experts/view-experts.component';
import { ViewExpertComponent } from './shared/view-expert/view-expert.component';


@NgModule({
  declarations: [
    MyDialogComponent, 
    MapComponent, 
    DocumentsUploadedComponent, 
    StatusProceduresComponent, 
    ViewOwnerComponent, ViewExpertsComponent, ViewExpertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  entryComponents: [MyDialogComponent, MapComponent],
  exports: [
    MyDialogComponent, 
    MapComponent, 
    DocumentsUploadedComponent, 
    StatusProceduresComponent,
    ViewOwnerComponent,
    ViewExpertComponent,
    ViewExpertsComponent
  ],
  providers: [DocumentsUploadedPipe, StatusPipe]
})
export class ComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
