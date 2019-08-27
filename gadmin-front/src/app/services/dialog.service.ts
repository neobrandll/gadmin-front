import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  dialogSubscription: Subscription;

  openSimpleDialog(title: string, message: string, action: any) {
    const dialogRef = this.dialog.open(DialogComponent, { data: { title, message, action } });
    this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
      action();
      this.dialogSubscription.unsubscribe();
    });
  }
}
