import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '../material/material.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';
import { MenuNavbarComponent } from './components/menu-navbar/menu-navbar.component';
import { RouterModule } from '@angular/router';
import { CustomInputFileComponent } from './components/custom-input-file/custom-input-file.component';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [
    DialogComponent,
    LoadingSpinnerComponent,
    MenuNavbarComponent,
    CustomInputFileComponent
  ],
  exports: [
    DialogComponent,
    LoadingSpinnerComponent,
    MenuNavbarComponent,
    CustomInputFileComponent
  ],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
