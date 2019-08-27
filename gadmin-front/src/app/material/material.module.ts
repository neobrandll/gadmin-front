import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

const Material = [MatDialogModule, MatButtonModule];

@NgModule({
  imports: [Material],
  exports: [Material]
})
export class MaterialModule {}
