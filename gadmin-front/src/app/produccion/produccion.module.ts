import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ProduccionPageComponent } from './produccion-page/produccion-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { ProductoPageComponent } from './producto-page/producto-page.component';
import { CreateProduccionComponent } from './create-produccion/create-produccion.component';
import { UpdateProduccionComponent } from './update-produccion/update-produccion.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ProduccionPageComponent, canActivate: [AuthGuard] },
  { path: 'create/:producto', component: CreateProduccionComponent, canActivate: [AuthGuard] },
  {
    path: 'update/:producto/:idProduccion',
    component: UpdateProduccionComponent,
    canActivate: [AuthGuard]
  },
  { path: ':producto', component: ProductoPageComponent, canActivate: [AuthGuard] }
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
  declarations: [
    ProduccionPageComponent,
    ProductoPageComponent,
    CreateProduccionComponent,
    UpdateProduccionComponent
  ]
})
export class ProduccionModule {}
