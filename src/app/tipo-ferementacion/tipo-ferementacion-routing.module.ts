import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoFerementacionPage } from './tipo-ferementacion.page';

const routes: Routes = [
  {
    path: '',
    component: TipoFerementacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoFerementacionPageRoutingModule {}
