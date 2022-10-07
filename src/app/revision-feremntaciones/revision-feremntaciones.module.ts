import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisionFeremntacionesPageRoutingModule } from './revision-feremntaciones-routing.module';

import { RevisionFeremntacionesPage } from './revision-feremntaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisionFeremntacionesPageRoutingModule
  ],
  declarations: [RevisionFeremntacionesPage]
})
export class RevisionFeremntacionesPageModule {}
