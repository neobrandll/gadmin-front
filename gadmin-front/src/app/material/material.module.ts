import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

const Material = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDividerModule
];

@NgModule({
  imports: [Material],
  exports: [Material]
})
export class MaterialModule {}
