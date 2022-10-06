import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'regiones',
    loadChildren: () => import('./regiones/regiones.module').then( m => m.RegionesPageModule)
  },
  {
    path: 'tipo-ferementacion',
    loadChildren: () => import('./tipo-ferementacion/tipo-ferementacion.module').then( m => m.TipoFerementacionPageModule)
  },  {
    path: 'tipo-cafe',
    loadChildren: () => import('./tipo-cafe/tipo-cafe.module').then( m => m.TipoCafePageModule)
  },
  {
    path: 'tipo-nanolote',
    loadChildren: () => import('./tipo-nanolote/tipo-nanolote.module').then( m => m.TipoNanolotePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
