import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '../material/material.module';
import { LoadingSpinerComponent } from './components/loading-spiner/loading-spiner.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [DialogComponent, LoadingSpinerComponent, HeaderComponent],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
