import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiePraticheRoutingModule } from './mie-pratiche-routing.module';
import { MiePraticheComponent } from './mie-pratiche.component';
import { MaterialModule } from '../core/module/material/material.module';
import { ComponentsModule } from '../core/components/components.module';
import { PipesModule } from '../core/pipes/pipes.module';



@NgModule({
  declarations: [
    MiePraticheComponent,
  ],
  imports: [
    CommonModule,
    MiePraticheRoutingModule,
    MaterialModule,
    ComponentsModule,
    PipesModule
  ]
})
export class MiePraticheModule { }
