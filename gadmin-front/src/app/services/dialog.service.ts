import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  dialogSubscription: Subscription;
  confirmDialogSubscription: Subscription;

  openSimpleDialog(title: string, message: string, action: any) {
    const dialogRef = this.dialog.open(DialogComponent, { data: { title, message, action } });
    this.dialogSubscription = dialogRef.afterClosed().subscribe(() => {
      action();
      this.dialogSubscription.unsubscribe();
    });
  }

  openConfirmDialog(title: string, message: string, action: any) {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message, action }
    });
    this.confirmDialogSubscription = confirmDialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        action();
      }
      this.confirmDialogSubscription.unsubscribe();
    });
  }
}
