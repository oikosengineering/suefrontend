import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../components/my-dialog/my-dialog.component';
import { MapComponent } from '../components/map/map.component';

@Injectable({
  providedIn: 'root'
})
export class DialogMessageService {

  constructor(public dialog: MatDialog) {}

  openDialog(title: string, message: string) {
    console.log('entrato');
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '250px',
      data: {title: title, message: message}
    });

    return dialogRef.afterClosed();
  }

  openMap(data: any) {
    console.log('entrato');
    const dialogRef = this.dialog.open(MapComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      panelClass: 'map_dialog',
      data: data
    });

    return dialogRef.afterClosed();
  }
}
