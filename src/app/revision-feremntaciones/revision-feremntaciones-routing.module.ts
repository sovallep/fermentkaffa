import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisionFeremntacionesPage } from './revision-feremntaciones.page';

const routes: Routes = [
  {
    path: '',
    component: RevisionFeremntacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisionFeremntacionesPageRoutingModule {}
