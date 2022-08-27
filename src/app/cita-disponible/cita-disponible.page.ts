import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cita-disponible',
  templateUrl: './cita-disponible.page.html',
  styleUrls: ['./cita-disponible.page.scss'],
})
export class CitaDisponiblePage implements OnInit {

  @Input() doctor: any;
  @Input() sucursal: any;
  @Input() disponibles: any;

  constructor(
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  /**
   * asignar horario disponible para cita
   */
  asignar(libre) {
    const partesFecha = libre.fecha.split('/');
    const cita = {
      id: libre.idHora,
      doctor: this.doctor,
      paciente: { nombre: 'VACIO' },
      servicio: { nombre: 'VACIO' },
      especialidad: { nombre: 'VACIO' },
      ubicacion: this.sucursal,
      fecha: partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0],
      estado: 'LIBRE'
    };
    localStorage.setItem('cita', JSON.stringify(cita));
    this.navController.navigateForward(['/asignar-solicitante']);
    this.modalController.dismiss();
  }

  cerrar() {
    this.modalController.dismiss();
  }

}
