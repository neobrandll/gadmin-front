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
  MatPaginatorIntl,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MatSortModule
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
  MatPaginatorModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSortModule
];

@NgModule({
  imports: [Material],
  exports: [Material],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class MaterialModule {}
