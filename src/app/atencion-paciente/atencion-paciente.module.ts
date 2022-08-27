import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AtencionPacientePage } from './atencion-paciente.page';
import { ComponentsModule } from '../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: AtencionPacientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [AtencionPacientePage]
})
export class AtencionPacientePageModule { }
