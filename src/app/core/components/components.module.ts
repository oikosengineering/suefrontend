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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewExpertsComponent } from './shared/view-experts/view-experts.component';
import { ViewExpertComponent } from './shared/view-expert/view-expert.component';
import { ViewAdministratorComponent } from './shared/view-administrator/view-administrator.component';
import { ViewSupplierComponent } from './shared/view-supplier/view-supplier.component';
import { ViewRotturaSuoloComponent } from './shared/details/view-rottura-suolo/view-rottura-suolo.component';
// tslint:disable-next-line: max-line-length
import { ViewOccupazioneSuoloEdilizioComponent } from './shared/details/view-occupazione-suolo-edilizio/view-occupazione-suolo-edilizio.component';
// tslint:disable-next-line: max-line-length
import { ViewOccupazioneSuoloPubblicoComponent } from './shared/details/view-occupazione-suolo-pubblico/view-occupazione-suolo-pubblico.component';
import { ViewTraslochiLavoriComponent } from './shared/details/view-traslochi-lavori/view-traslochi-lavori.component';
import { PraticheModule } from 'src/app/pratiche/pratiche.module';
import { ViewDocumentsComponent } from './shared/documents/view-documents/view-documents.component';
import { UploadDocumentsComponent } from './shared/documents/upload-documents/upload-documents.component';
import { CreateExtensionComponent } from './shared/extensions/create-extension/create-extension.component';
import { ViewExtensionsComponent } from './shared/extensions/view-extensions/view-extensions.component';
import { FilterProceduresComponent } from './shared/filter-procedures/filter-procedures.component';
import { ViewExtensionComponent } from './shared/extensions/view-extension/view-extension.component';
import { PipesModule } from '../pipes/pipes.module';
import { FileExtensionsPipe } from '../pipes/file-extensions.pipe';


@NgModule({
  declarations: [
    MyDialogComponent,
    MapComponent,
    DocumentsUploadedComponent,
    StatusProceduresComponent,
    ViewOwnerComponent,
    ViewExpertsComponent,
    ViewExpertComponent,
    ViewAdministratorComponent,
    ViewSupplierComponent,
    ViewRotturaSuoloComponent,
    ViewOccupazioneSuoloEdilizioComponent,
    ViewOccupazioneSuoloPubblicoComponent,
    ViewTraslochiLavoriComponent,
    ViewDocumentsComponent,
    UploadDocumentsComponent,
    CreateExtensionComponent,
    ViewExtensionsComponent,
    FilterProceduresComponent,
    ViewExtensionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    PraticheModule,
    PipesModule,
  ],
  entryComponents: [MyDialogComponent, MapComponent],
  exports: [
    MyDialogComponent,
    MapComponent,
    DocumentsUploadedComponent,
    StatusProceduresComponent,
    ViewOwnerComponent,
    ViewExpertComponent,
    ViewExpertsComponent,
    ViewAdministratorComponent,
    ViewSupplierComponent,
    ViewRotturaSuoloComponent,
    ViewOccupazioneSuoloEdilizioComponent,
    ViewOccupazioneSuoloPubblicoComponent,
    ViewTraslochiLavoriComponent,
    ViewDocumentsComponent,
    UploadDocumentsComponent,
    CreateExtensionComponent,
    ViewExtensionsComponent,
    FilterProceduresComponent,
    ViewExtensionComponent
  ],
  providers: [DocumentsUploadedPipe, StatusPipe, FileExtensionsPipe]
})
export class ComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
