import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloComponent } from './modulo/modulo.component';
import { DynamicFormDirective } from './directives/dynamic-form.directive';
import { PraticheRoutingModule } from './pratiche-routing.module';
import { ComponentsModule } from '../core/components/components.module';
import { DettagliPraticaComponent } from './dettagli-pratica/dettagli-pratica.component';
import { RotturaSuoloComponent } from './moduli/components-edilizia/rottura-suolo/rottura-suolo.component';
import { MaterialModule } from '../core/module/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EdiliziaComponent } from './moduli/edilizia/edilizia.component';
import { DetailsPraticheDirective } from './directives/details-pratiche.directive';


@NgModule({
  declarations: [ModuloComponent, DynamicFormDirective, DettagliPraticaComponent, DetailsPraticheDirective],
  entryComponents: [EdiliziaComponent, RotturaSuoloComponent],
  imports: [
    CommonModule,
    PraticheRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    DynamicFormDirective,
    DetailsPraticheDirective
  ]
})
export class PraticheModule { }
