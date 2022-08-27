import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-atencion-paciente',
  templateUrl: './atencion-paciente.page.html',
  styleUrls: ['./atencion-paciente.page.scss'],
})
export class AtencionPacientePage implements OnInit {
  @ViewChild('alergias') alergias;
  @ViewChild('causaConsulta') causaConsulta;
  @ViewChild('enfermedades') enfermedades;
  @ViewChild('receta') receta;
  @ViewChild('sintomas') sintomas;
  @ViewChild('tiempo') tiempo;
  @ViewChild('presion') presion;
  @ViewChild('pulmones') pulmones;
  @ViewChild('fechaCita') fechaCita;
  @ViewChild('medicamentos') medicamentos;
  @ViewChild('notas') notas;
  consultaAnte;
  idCita;
  servicio;
  paciente;
  fecha;
  sexo;

  constructor(
    private navController: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private restApiService: RestApiService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.idCita = params.cita.toString().replace('"', '').replace('"', '');
        console.log(this.idCita);
        this.restApiService.getCita(this.idCita).then((respuesta: any) => {
          if (respuesta !== null && respuesta !== undefined) {
            console.log('consulta:', respuesta);
            this.consultaAnte = respuesta;
            this.servicio = respuesta.servicio.nombre;
            this.fecha = respuesta.fecha;
            if (respuesta.paciente._id !== undefined) {
              this.restApiService.getPaciente(respuesta.paciente._id).then((respuesta: any) => {
                if (respuesta !== null && respuesta !== undefined) {
                  console.log(respuesta);
                  this.paciente = respuesta.primerNombre.toUpperCase() + ' ' + respuesta.primerApellido.toUpperCase();
                  this.sexo = respuesta.sexo;
                }
              })
            }
          }
        });
      }
    });
  }

  regresar() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        defaultSucursal: false,
        reload: true
      }
    };
    localStorage.setItem('actualizarListado', 'true');
    this.navController.navigateRoot(['/agenda'], navigationExtras);
  }

  guardar() {
    if (this.alergias.value !== '' && this.causaConsulta.value !== '' && this.sintomas.value !== '') {
      this.consultaAnte.consulta = {
        motivoConsulta: this.causaConsulta.value,
        alegias: this.alergias.value,
        enfermedadesAnteriores: this.enfermedades.value,
        recetasAnteriores: this.receta.value,
        sintomas: this.sintomas.value,
        tiempoSintomas: this.tiempo.value,
        presion: this.presion.value,
        pulmones: this.pulmones.value,
        fechaProximaCita: this.fechaCita.value,
        medicamentos: this.medicamentos.value,
        notas: this.sintomas.value
      }
      this.consultaAnte.estado = 'ATENDIDA';
      console.log('cita a guardar:', this.consultaAnte);
      this.restApiService.guardarCita(this.consultaAnte, (res: any) => {
        console.log(res);
        if (res) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              reload: true
            }
          };
          localStorage.setItem('actualizarListado', 'true');
          this.navController.navigateRoot(['/agenda'], navigationExtras);
        } else {
          this.errorGuardar();
        }
      })
    } else {
      this.presentAlertCampos();
    }
  }

  async presentAlertCampos() {
    const alert = await this.alertController.create({
      header: 'Atencion!',
      message: '<strong>Ingrese Todos los campos obligatorios</strong>',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async errorGuardar() {
    const alert = await this.alertController.create({
      header: 'Atencion!',
      message: '<strong>Ocurrio un error al almacenar la cita</strong>',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

}