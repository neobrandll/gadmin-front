import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule
} from '@angular/material';

const Material = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDividerModule,
  MatStepperModule
];

@NgModule({
  imports: [Material],
  exports: [Material]
})
export class MaterialModule {}
