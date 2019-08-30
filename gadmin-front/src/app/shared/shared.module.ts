import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '../material/material.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';
import { MenuNavbarComponent } from './components/menu-navbar/menu-navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [DialogComponent, LoadingSpinnerComponent, MenuNavbarComponent],
  exports: [DialogComponent, LoadingSpinnerComponent, MenuNavbarComponent],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
