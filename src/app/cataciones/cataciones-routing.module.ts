import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatacionesPage } from './cataciones.page';

const routes: Routes = [
  {
    path: '',
    component: CatacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatacionesPageRoutingModule {}
