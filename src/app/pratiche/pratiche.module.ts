import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloComponent } from './modulo/modulo.component';
import { DynamicFormDirective } from './directives/dynamic-form.directive';
import { RichiestaRotturaSuoloComponent } from './moduli/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { PraticheRoutingModule } from './pratiche-routing.module';
import { ComponentsModule } from '../core/components/components.module';
import { DettagliPraticaComponent } from './dettagli-pratica/dettagli-pratica.component';
import { RotturaSuoloComponent } from './moduli/rottura-suolo/rottura-suolo.component';
import { MaterialModule } from '../core/module/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ModuloComponent, DynamicFormDirective, DettagliPraticaComponent],
  entryComponents: [RichiestaRotturaSuoloComponent, RotturaSuoloComponent],
  imports: [
    CommonModule,
    PraticheRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PraticheModule { }
