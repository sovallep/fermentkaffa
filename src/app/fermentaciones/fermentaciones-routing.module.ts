import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FermentacionesPage } from './fermentaciones.page';

const routes: Routes = [
  {
    path: '',
    component: FermentacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FermentacionesPageRoutingModule {}
