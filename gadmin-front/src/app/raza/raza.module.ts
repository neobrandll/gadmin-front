import { CoreModule } from '../core.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RazaPageComponent } from './components/raza-page/raza-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { CreateRazaComponent } from './components/create-raza/create-raza.component';
import { UpdateRazaComponent } from './components/update-raza/update-raza.component';

const routes: Routes = [
  {
    path: '',
    component: RazaPageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  { path: 'create', component: CreateRazaComponent, canActivate: [AuthGuard] },
  { path: 'update/:idRaza', component: UpdateRazaComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    CoreModule
  ],
  declarations: [RazaPageComponent, CreateRazaComponent, UpdateRazaComponent]
})
export class RazaModule {}
