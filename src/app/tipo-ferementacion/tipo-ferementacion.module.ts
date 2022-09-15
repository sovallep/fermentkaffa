import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoFerementacionPageRoutingModule } from './tipo-ferementacion-routing.module';

import { TipoFerementacionPage } from './tipo-ferementacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoFerementacionPageRoutingModule
  ],
  declarations: [TipoFerementacionPage]
})
export class TipoFerementacionPageModule {}
