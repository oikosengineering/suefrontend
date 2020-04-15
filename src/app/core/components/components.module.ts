import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { MapComponent } from './map/map.component';
import { MaterialModule } from '../module/material/material.module';



@NgModule({
  declarations: [MyDialogComponent, MapComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [MyDialogComponent, MapComponent],
  exports: [MyDialogComponent, MapComponent]
})
export class ComponentsModule { }
