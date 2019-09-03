import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'empresa',
    loadChildren: () => import('./empresa/empresa.module').then(m => m.EmpresaModule)
  },
  {
    path: 'raza',
    loadChildren: () => import('./raza/raza.module').then(m => m.RazaModule)
  },
  {
    path: 'ganado',
    loadChildren: () => import('./ganado/ganado.module').then(m => m.GanadoModule)
  },
  {
    path: 'pajuela',
    loadChildren: () => import('./pajuela/pajuela.module').then(m => m.PajuelaModule)
  },
  {
    path: 'produccion',
    loadChildren: () => import('./produccion/produccion.module').then(m => m.ProduccionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
