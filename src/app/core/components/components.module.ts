import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDialogComponent } from './my-dialog/my-dialog.component';



@NgModule({
  declarations: [MyDialogComponent],
  imports: [
    CommonModule,
  ],
  entryComponents: [MyDialogComponent],
  exports: [MyDialogComponent]
})
export class ComponentsModule { }
