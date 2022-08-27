import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { AsignarSolicitantePage } from './asignar-solicitante.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarSolicitantePage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  declarations: [AsignarSolicitantePage],
  exports: [RouterModule]
})
export class AsignarSolicitantePageModule {}
