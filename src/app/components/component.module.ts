import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { ListaAgendaComponent } from './lista-agenda/lista-agenda.component';
import { BrMaskerModule } from 'br-mask';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    ListaAgendaComponent,
    NavBarComponent,
  ],
  exports: [
    ListaAgendaComponent,
    NavBarComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    BrMaskerModule
  ]
})
export class ComponentsModule { }
