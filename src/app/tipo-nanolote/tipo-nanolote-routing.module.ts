import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoNanolotePage } from './tipo-nanolote.page';

const routes: Routes = [
  {
    path: '',
    component: TipoNanolotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoNanolotePageRoutingModule {}
