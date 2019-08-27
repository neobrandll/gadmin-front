import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '../material/material.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [DialogComponent, LoadingSpinnerComponent],
  exports: [DialogComponent, LoadingSpinnerComponent],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
