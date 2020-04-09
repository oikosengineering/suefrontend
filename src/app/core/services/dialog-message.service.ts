import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../components/my-dialog/my-dialog.component';

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
}
