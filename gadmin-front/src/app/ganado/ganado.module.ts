import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { AuthGuard } from '../guards/auth.guard';
import { GanadoPageComponent } from './components/ganado-page/ganado-page.component';
import { CreateGanadoComponent } from './components/create-ganado/create-ganado.component';
import { GanadoProfileComponent } from './components/ganado-profile/ganado-profile.component';

const routes: Routes = [
  {
    path: '',
    component: GanadoPageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: CreateGanadoComponent,
    canActivate: [AuthGuard]
  },
  { path: ':coGanado', component: GanadoProfileComponent, canActivate: [AuthGuard] }
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
  declarations: [GanadoPageComponent, CreateGanadoComponent, GanadoProfileComponent]
})
export class GanadoModule {}
