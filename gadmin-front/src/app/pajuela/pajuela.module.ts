import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { PajuelaPageComponent } from './components/pajuela-page/pajuela-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePajuelaComponent } from './components/create-pajuela/create-pajuela.component';
import { UpdatePajuelaComponent } from './components/update-pajuela/update-pajuela.component';

const routes: Routes = [
  { path: '', component: PajuelaPageComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'create', component: CreatePajuelaComponent, canActivate: [AuthGuard] },
  { path: 'update/:coPajuela', component: UpdatePajuelaComponent, canActivate: [AuthGuard] }
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
  declarations: [PajuelaPageComponent, CreatePajuelaComponent, UpdatePajuelaComponent]
})
export class PajuelaModule {}
