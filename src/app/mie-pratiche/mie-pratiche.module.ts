import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiePraticheRoutingModule } from './mie-pratiche-routing.module';
import { MiePraticheComponent } from './mie-pratiche.component';
import { DettagliPraticaComponent } from './dettagli-pratica/dettagli-pratica.component';
import { MaterialModule } from '../core/module/material/material.module';
import { StatusPipe } from '../core/pipes/status.pipe';
import { DocumentsUploadedPipe } from '../core/pipes/documents-uploaded.pipe';
import { CategoryPipe } from '../core/pipes/category.pipe';
import { ComponentsModule } from '../core/components/components.module';
import { DelegatedPipe } from '../core/pipes/delegated.pipe';
import { CanExtendedPipe } from '../core/pipes/can-extended.pipe';



@NgModule({
  declarations: [
    MiePraticheComponent, 
    DettagliPraticaComponent,
    DocumentsUploadedPipe,
    CategoryPipe,
    StatusPipe,
    DelegatedPipe,
    CanExtendedPipe
  ],
  imports: [
    CommonModule,
    MiePraticheRoutingModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class MiePraticheModule { }
