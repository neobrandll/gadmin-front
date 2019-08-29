import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '../material/material.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';

@NgModule({
  imports: [CommonModule, MaterialModule, HttpClientModule],
  declarations: [DialogComponent, LoadingSpinnerComponent],
  exports: [DialogComponent, LoadingSpinnerComponent],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
