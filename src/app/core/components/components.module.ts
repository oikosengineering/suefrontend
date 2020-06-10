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
import { ViewAdministratorComponent } from './shared/view-administrator/view-administrator.component';
import { ViewSupplierComponent } from './shared/view-supplier/view-supplier.component';
import { ViewRotturaSuoloComponent } from './shared/details/view-rottura-suolo/view-rottura-suolo.component';
import { ViewOccupazioneSuoloEdilizioComponent } from './shared/details/view-occupazione-suolo-edilizio/view-occupazione-suolo-edilizio.component';
import { ViewOccupazioneSuoloPubblicoComponent } from './shared/details/view-occupazione-suolo-pubblico/view-occupazione-suolo-pubblico.component';
import { ViewTraslochiLavoriComponent } from './shared/details/view-traslochi-lavori/view-traslochi-lavori.component';
import { PraticheModule } from 'src/app/pratiche/pratiche.module';


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
    ViewTraslochiLavoriComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PraticheModule
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
    ViewTraslochiLavoriComponent
  ],
  providers: [DocumentsUploadedPipe, StatusPipe]
})
export class ComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
