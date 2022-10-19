import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FermentacionesPageRoutingModule } from './fermentaciones-routing.module';
import { FermentacionesPage } from './fermentaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FermentacionesPageRoutingModule
  ],
  declarations: [FermentacionesPage]
})
export class FermentacionesPageModule {}
