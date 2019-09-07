import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { PartoPageComponent } from './components/parto-page/parto-page.component';
import { CreatePartoComponent } from './create-parto/create-parto.component';

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
  declarations: [PartoPageComponent, CreatePartoComponent]
})
export class PartoModule {}
