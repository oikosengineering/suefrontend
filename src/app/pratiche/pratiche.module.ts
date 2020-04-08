import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloComponent } from './modulo/modulo.component';
import { DynamicFormDirective } from './directives/dynamic-form.directive';
import { RichiestaRotturaSuoloComponent } from './moduli/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { PraticheRoutingModule } from './pratiche-routing.module';


@NgModule({
  declarations: [ModuloComponent, DynamicFormDirective],
  entryComponents: [RichiestaRotturaSuoloComponent],
  imports: [
    CommonModule,
    PraticheRoutingModule
  ]
})
export class PraticheModule { }
