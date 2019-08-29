import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatPaginatorIntl
} from '@angular/material';
import { CustomPaginator } from './custom-paginator';

const Material = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDividerModule,
  MatStepperModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule
];

@NgModule({
  imports: [Material],
  exports: [Material],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class MaterialModule {}
