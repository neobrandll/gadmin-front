import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guards/auth.guard';
import { GanadoPageComponent } from './components/ganado-page/ganado-page.component';

const routes: Routes = [
  {
    path: '',
    component: GanadoPageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule
  ],
  declarations: [GanadoPageComponent]
})
export class GanadoModule {}
