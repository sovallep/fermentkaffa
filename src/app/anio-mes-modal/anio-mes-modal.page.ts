import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-anio-mes-modal',
  templateUrl: './anio-mes-modal.page.html',
  styleUrls: ['./anio-mes-modal.page.scss'],
})
export class AnioMesModalPage implements OnInit {

  @Input() currentDate;
  @Input() monthNames;

  anios = [];

  @ViewChild('anio', { static: true }) anio: IonSelect;
  @ViewChild('mes', { static: true }) mes: IonSelect;

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    const anioActual = new Date().getFullYear();
    for (let i = 2017; i < anioActual + 2; i++) {
      this.anios.push(i);
    }
  }

  ionViewWillEnter() {
    if (this.anios.length > 0) {
      this.anio.value = this.currentDate.getFullYear();
    }
    if (this.monthNames.length > 0) {
      this.mes.value = this.currentDate.getMonth();
    }
  }

  seleccionar() {
    if (this.anio !== undefined && this.mes.value !== undefined) {
      this.modalController.dismiss({ mes: this.mes.value, anio: this.anio.value });
    }
    this.modalController.dismiss();
  }

}
