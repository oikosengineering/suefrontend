import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloComponent } from './modulo/modulo.component';
import { DynamicFormDirective } from './directives/dynamic-form.directive';
import { PraticheRoutingModule } from './pratiche-routing.module';
import { ComponentsModule } from '../core/components/components.module';
import { RotturaSuoloComponent } from './moduli/components-edilizia/rottura-suolo/rottura-suolo.component';
import { MaterialModule } from '../core/module/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EdiliziaComponent } from './moduli/edilizia/edilizia.component';
import { DetailsPraticheDirective } from './directives/details-pratiche.directive';
import { OccupazioneEdileComponent } from './moduli/components-edilizia/occupazione-edile/occupazione-edile.component';
import { OccupazioneSuoloPubblicoComponent } from './moduli/components-edilizia/occupazione-suolo-pubblico/occupazione-suolo-pubblico.component';
import { OccupazioneTraslochiLavoriComponent } from './moduli/components-edilizia/occupazione-traslochi-lavori/occupazione-traslochi-lavori.component';
import { OwnerComponent } from './moduli/components-edilizia/owner/owner.component';
import { ExpertsComponent } from './moduli/components-edilizia/experts/experts.component';
import { SupplierComponent } from './moduli/components-edilizia/supplier/supplier.component';
import { AdministratorComponent } from './moduli/components-edilizia/administrator/administrator.component';


@NgModule({
  declarations: [
    ModuloComponent,
    DynamicFormDirective, 
    DetailsPraticheDirective, 
    OccupazioneEdileComponent, 
    OccupazioneSuoloPubblicoComponent, 
    OccupazioneTraslochiLavoriComponent, 
    OwnerComponent, 
    ExpertsComponent, 
    SupplierComponent, 
    AdministratorComponent
  ],
  entryComponents: [EdiliziaComponent, RotturaSuoloComponent, OwnerComponent],
  imports: [
    CommonModule,
    PraticheRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    DynamicFormDirective,
    DetailsPraticheDirective,
    OwnerComponent,
    ExpertsComponent,
    SupplierComponent,
    AdministratorComponent
  ]
})
export class PraticheModule { }
