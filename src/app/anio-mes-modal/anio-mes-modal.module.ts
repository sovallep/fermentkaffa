import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AnioMesModalPage } from './anio-mes-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AnioMesModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AnioMesModalPage]
})
export class AnioMesModalPageModule {}
