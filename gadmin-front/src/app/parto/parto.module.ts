import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { PartoPageComponent } from './components/parto-page/parto-page.component';
import { CreatePartoComponent } from './components/create-parto/create-parto.component';
import { PartoComponent } from './components/parto/parto.component';

const routes: Routes = [
  {
    path: '',
    component: PartoPageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: CreatePartoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':idParto',
    component: PartoComponent,
    canActivate: [AuthGuard]
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
  declarations: [PartoPageComponent, CreatePartoComponent, PartoComponent]
})
export class PartoModule {}
