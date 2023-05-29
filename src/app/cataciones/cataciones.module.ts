import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatacionesPageRoutingModule } from './cataciones-routing.module';
import { CatacionesPage } from './cataciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatacionesPageRoutingModule
  ],
  declarations: [CatacionesPage]
})
export class CatacionesPageModule {}
