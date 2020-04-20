import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { MapComponent } from './map/map.component';
import { MaterialModule } from '../module/material/material.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [MyDialogComponent, MapComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule
  ],
  entryComponents: [MyDialogComponent, MapComponent],
  exports: [MyDialogComponent, MapComponent]
})
export class ComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
 }
