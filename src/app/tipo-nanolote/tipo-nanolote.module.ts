import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoNanolotePageRoutingModule } from './tipo-nanolote-routing.module';

import { TipoNanolotePage } from './tipo-nanolote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoNanolotePageRoutingModule
  ],
  declarations: [TipoNanolotePage]
})
export class TipoNanolotePageModule {}
