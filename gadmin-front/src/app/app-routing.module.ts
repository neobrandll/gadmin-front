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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
