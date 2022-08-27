import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegionesPageRoutingModule } from './regiones-routing.module';
import { RegionesPage } from './regiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegionesPageRoutingModule
  ],
  declarations: [RegionesPage]
})
export class RegionesPageModule {}
