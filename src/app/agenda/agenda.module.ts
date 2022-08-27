import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPage } from './agenda.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { Routes, RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from '../components/component.module';


const routes: Routes = [
  {
    path: '',
    component: AgendaPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    ComponentsModule,
    
  ],
  declarations: [AgendaPage],
  exports: [RouterModule]
})
export class AgendaPageModule { }
