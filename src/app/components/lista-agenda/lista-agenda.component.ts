import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'lista-agenda',
  templateUrl: './lista-agenda.component.html',
  styleUrls: ['./lista-agenda.component.scss'],
})

export class ListaAgendaComponent implements OnInit {
  @Input() filtros;
  @Input() fecha;
  @Input() listaDoctores;
  @Input() horariosSabados;

  listaCitas;
  horasOcupadas;
  originalCitas;
  citaSinAgenda;
  mostrarEmergencias;
  esSabado;
  cita;
  fechaTexto;
  respuestaTipoAlerta = null;


  constructor(
    public loadingController: LoadingController,
    private restApiService: RestApiService,
    private navController: NavController,
    private alertController: AlertController,
  ) { }


  ngOnInit() {
  }

  /**
   * funcion para cargar todos los datos de agenda
   */
  async sync() {
    const loading = await this.loadingController.create({
      spinner: 'crescent'
    });
    this.mostrarEmergencias = false;
    this.originalCitas = [];
    await loading.present().then(() => {
      this.esSabado = false;
      const fechaHoy = new Date(this.fecha);
      fechaHoy.setDate(fechaHoy.getDate() + 1);
      /**
       * servicio cita para obtener el listado de citas por la fecha
       */
      this.restApiService.obtenerCitas(fechaHoy).then((citas: any) => {
        this.listaCitas = [];
        this.horasOcupadas = [];
        citas.forEach(citaIterada => {
          const horaCita = citaIterada.id.substring(8, 12);
          citaIterada.doc.id = horaCita;
          const pacienteCita = citaIterada.doc.paciente;
          if (pacienteCita.primerNombre !== undefined) {
            citaIterada.doc.paciente.nombre = pacienteCita.primerNombre + ' ' + pacienteCita.segundoNombre + ' ';
            citaIterada.doc.paciente.nombre += pacienteCita.primerApellido + ' ' + pacienteCita.segundoApellido;
            citaIterada.doc.telefono = pacienteCita.telefonoCelular;
          }
          this.listaCitas.push(citaIterada.doc);
          this.horasOcupadas.push({
            sucursal: citaIterada.doc.ubicacion, hora: parseInt(horaCita, 10),
            doctor: { id: citaIterada.doc.doctor.id }
          });
        });
        this.llenarHorasLibres().then(() => {
          this.listaCitas = this.listaCitas.sort((a, b) => {
            if (parseInt(a.id, 10) > parseInt(b.id, 10)) {
              return 1;
            } else {
              return -1;
            }
          });
          this.originalCitas = this.listaCitas;
          if (this.filtros !== undefined) {
            this.filtradoListado(this.filtros);
          }
          loading.dismiss();
        });
      }).catch(() => {
        loading.dismiss();
      });
    });
  }

  /**
   * funcion que muestra los horarios disponibles para citas
   */
  agregarHoraLibre(hora, doctorElegido, sucursal) {
    doctorElegido.nombre = doctorElegido.name;
    sucursal.nombre = sucursal.name;
    const stringFecha = ('0' + Math.round(hora * 100)).slice(-4);
    const libre = {
      id: stringFecha,
      doctor: doctorElegido,
      paciente: { nombre: 'VACIO' },
      servicio: { nombre: 'VACIO' },
      especialidad: { nombre: 'VACIO' },
      ubicacion: sucursal,
      fecha: this.fecha,
      estado: 'LIBRE'
    };
    this.listaCitas.push(libre);
  }

  /**
   * funcion que llena las horas con los datos de los doctores
   */
  llenarHorasLibres() {
    return new Promise((resolve) => {
      /**
       * servicio catalogo para obtener un catalogo por su nombre
       */
      this.restApiService.getDoctores((doc: any) => {
        const fechaActual = new Date(this.fecha);
        fechaActual.setDate(fechaActual.getDate() + 1);
        const listado = doc;
        // if (fechaActual.getDay() === 6) {
        //   this.esSabado = true;
        //   const sabado = Math.ceil(fechaActual.getDate() / 7);
        /**
         * servicio de catalogo para obtener los horarios de los sábados
         */
        // this.catalogoService.obtenerHorarioSabados().then((horarios: any) => {
        //   this.horariosSabados = horarios.sabados;
        //   for (const doctor of listado) {
        //     for (const sucursal of doctor.sucursals) {
        //       const horario = this.horariosSabados.find((el) => {
        //         return el.idSucursal === sucursal.id && el.idDoctor === doctor.id && el.sabado === sabado;
        //       });
        //       if (horario !== undefined) {
        //         this.llenarHorasPorDoctor(doctor, sucursal, fechaActual);
        //       }
        //     }
        //   }
        //   // apertura de agenda
        //   for (const doctor of listado) {
        //     for (const sucursal of doctor.sucursals) {
        //       if (sucursal.apertura !== undefined) {
        //         this.llenarHorasPorDoctor(doctor, sucursal, fechaActual);
        //       }
        //     }
        //   }
        //   resolve(true);
        // });
        // } else {
        // this.esSabado = false;
        for (const doctor of listado) {
          for (const sucursal of doctor.sucursals) {
            this.llenarHorasPorDoctor(doctor, sucursal, fechaActual);
          }
        }
        resolve(true);
        // }
      });
    });
  }

  /**
   * funcion que llena las horas por doctor
   */
  llenarHorasPorDoctor(doctor: any, sucursal: any, fechaActual: Date) {
    const yaPaso = this.listaCitas.find((el: any) => {
      return sucursal.id === el.ubicacion.id && doctor.id === parseInt(el.doctor.id, 10) && el.estado === 'LIBRE';
    });
    if (yaPaso) {
      return false;
    }
    const cambios = sucursal.cambios.filter((c: any) => {
      const fechaInicio = new Date(c.fechaInicio);
      const fechaFin = new Date(c.fechaFinal);
      const fechaIni = new Date(fechaInicio.getUTCFullYear(), fechaInicio.getUTCMonth(), fechaInicio.getUTCDate());
      const fechaFinal = new Date(fechaFin.getUTCFullYear(), fechaFin.getUTCMonth(), fechaFin.getUTCDate(), 23, 59, 59);
      return fechaActual >= fechaIni && fechaActual <= fechaFinal;
    });
    const diaActual = this.obtenerDiaSemana(fechaActual);
    const diaHorario = sucursal.semana.find((dia: any) => {
      return dia.name === diaActual;
    });
    if (diaHorario !== undefined) {
      for (const horaCita of diaHorario.dia) {
        const citasPorHora = [parseFloat(horaCita.hora), parseFloat(horaCita.hora) + 0.2, parseFloat(horaCita.hora) + 0.4];
        citasPorHora.forEach(hora => {
          let bloqueo;
          if (cambios.length > 0) { // hay cambios para este día
            bloqueo = cambios.find(b => {
              const horaInicioExcluir = new Date(b.fechaInicio).getUTCHours();
              const horaFinExcluir = new Date(b.fechaFinal).getUTCHours();
              return hora >= horaInicioExcluir && hora <= horaFinExcluir;
            });
          }
          if (bloqueo === undefined) {
            const ocupada = this.horasOcupadas.find((el: any) => {
              return el.hora === Math.round(hora * 100) && sucursal.id === el.sucursal.id
                && doctor.id === parseInt(el.doctor.id, 10);
            });
            if (ocupada === undefined) {
              this.agregarHoraLibre(hora, doctor, sucursal);
            }
          }
        });
      }
    }
    const aperturas = sucursal.apertura.filter((c: any) => {
      const fechaInicio = new Date(c.fechaInicio);
      const fechaFin = new Date(c.fechaFinal);
      const fechaIni = new Date(fechaInicio.getUTCFullYear(), fechaInicio.getUTCMonth(), fechaInicio.getUTCDate());
      const fechaFinal = new Date(fechaFin.getUTCFullYear(), fechaFin.getUTCMonth(), fechaFin.getUTCDate(), 23, 59, 59);
      return fechaActual >= fechaIni && fechaActual <= fechaFinal;
    });
    if (aperturas !== undefined) {
      aperturas.forEach(apertura => {
        const horaIterada = apertura.dia[0].hora;
        const citasPorHora = [horaIterada, horaIterada + 0.2, horaIterada + 0.4];
        citasPorHora.forEach(hora => {
          let bloqueo;
          if (cambios.length > 0) { // hay cambios para este día
            bloqueo = cambios.find(b => {
              const horaInicioExcluir = new Date(b.fechaInicio).getUTCHours();
              const horaFinExcluir = new Date(b.fechaFinal).getUTCHours();
              return hora >= horaInicioExcluir && hora <= horaFinExcluir;
            });
          }
          if (bloqueo === undefined) {
            const ocupada = this.horasOcupadas.find((el: any) => {
              return el.hora === Math.round(hora * 100) && sucursal.id === el.sucursal.id
                && doctor.id === parseInt(el.doctor.id, 10);
            });
            if (ocupada === undefined) {
              this.agregarHoraLibre(hora, doctor, sucursal);
            }
          }
        });
      });
    }
  }

  /**
   * Funcion para retornar el dia de la semana
   */
  obtenerDiaSemana(fecha) {
    const weekday = new Array(7);
    weekday[0] = 'Domingo';
    weekday[1] = 'Lunes';
    weekday[2] = 'Martes';
    weekday[3] = 'Miercoles';
    weekday[4] = 'Jueves';
    weekday[5] = 'Viernes';
    return weekday[fecha.getDay()];
  }

  /**
   * funcion para aplicar filtros
   */
  filtradoListado(filtros) {
    let resultado = this.originalCitas;
    if (filtros !== undefined) {
      if (filtros.paciente !== undefined) {
        resultado = resultado.filter((cita) => {
          const nombrePaciente = cita.paciente.nombre.toLowerCase();
          const term = filtros.paciente.nombre;
          if (nombrePaciente.indexOf(term) > -1) {
            return cita;
          }
          if (cita.paciente.telefonoCelular !== undefined && cita.paciente.telefonoCelular.indexOf(term) > -1) {
            return cita;
          }
        });
      }
      if (filtros.sucursal.id !== undefined) {
        resultado = resultado.filter((cita) => {
          if (cita.ubicacion.id === filtros.sucursal.id) {
            return cita;
          }
        });
      }
      if (filtros.doctor.id !== undefined) {
        resultado = resultado.filter((cita) => {
          if (cita.doctor.id === filtros.doctor.id) {
            return cita;
          }
        });
      }
      if (filtros.hour.id !== undefined) {
        resultado = resultado.filter((cita) => {
          let agregarHoraSabado = 0;
          if (this.esSabado && filtros.hour.minimo === 8) {
            agregarHoraSabado = 1;
          }
          const horaMinima = filtros.hour.minimo - agregarHoraSabado;
          const horaMaxima = filtros.hour.maximo;
          if (cita._id === undefined) {
            const horaCita = parseInt(cita.id.substr(0, 2), 10);
            if (horaCita >= horaMinima && horaCita <= horaMaxima) {
              return cita;
            }
          } else {
            const horaCita = parseInt(cita._id.substring(8, 10), 10);
            if (horaCita >= horaMinima && horaCita <= horaMaxima) {
              return cita;
            }
          }
        });
      }
    }
    this.listaCitas = resultado.sort((a, b) => {
      if (parseInt(a.id, 10) > parseInt(b.id, 10)) {
        return 1;
      } else {
        return -1;
      }
    });
    this.citaSinAgenda = this.listaCitas.filter(el => {
      return el.emergencia !== undefined;
    });
    this.mostrarEmergencias = false;
  }

  /**
   * funcion para crear una cita en asignar solicitante
   */
  asignar(cita) {
    localStorage.setItem('cita', JSON.stringify(cita));
    this.navController.navigateForward(['/asignar-solicitante']);
  }

  async cancelar(cita) {
    let nombrePaciente = cita.paciente.primerNombre + ' ' + cita.paciente.segundoNombre;
    nombrePaciente += ' ' + cita.paciente.primerApellido + ' ' + cita.paciente.segundoApellido;
    const tels = cita.paciente.telefonoCelular + ' / ' + cita.paciente.telefonoCasa;
    const alert = await this.alertController.create({
      header: 'Cancelar La Cita',
      cssClass: 'mensaje-alerta',
      message: 'Desea cancelar la cita?<br><br>' + nombrePaciente,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Sí, cancelar.',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'cancelando',
              spinner: 'crescent'
            });
            loading.present().then(() => {
              this.restApiService.getCita(cita._id).then((cita: any) => {
                if (cita != null) {
                  console.log(cita);
                  this.restApiService.eliminarCita(cita._id, (res) => {
                    console.log('cita eliminada', res);
                    if (res === true) {
                      loading.dismiss();
                      location.reload();
                    } else {
                      console.log('error al almacenar la cita editada');
                      loading.dismiss();
                    }
                  });
                } else {
                  console.log('error al cancelar la cita');
                }
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  atender(cita) {
    console.log(cita);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cita: JSON.stringify(cita._id)
      }
    };
    this.navController.navigateForward(['/atencion-paciente'], navigationExtras);
  }

  editar(cita) {
    this.mensajeConfirmacion(cita);
  }

  async mensajeConfirmacion(cita) {
    const alert = await this.alertController.create({
      header: 'Atencion!',
      cssClass: 'mensaje-alerta',
      message: 'Desea editar la cita ya almacenada?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Sí',
          handler: async () => {
            console.log(cita);
            const navigationExtras: NavigationExtras = {
              queryParams: {
                cita: JSON.stringify(cita._id)
              }
            };
            this.navController.navigateForward(['/atencion-paciente'], navigationExtras);
          }
        }
      ]
    });
    await alert.present();
  }



  async confirmar(cita) {
    let nombrePaciente = cita.paciente.primerNombre + ' ' + cita.paciente.segundoNombre;
    nombrePaciente += ' ' + cita.paciente.primerApellido + ' ' + cita.paciente.segundoApellido;
    const tels = cita.paciente.telefonoCelular + ' / ' + cita.paciente.telefonoCasa;
    const alert = await this.alertController.create({
      header: 'Confirmar Cita',
      cssClass: 'mensaje-alerta',
      message: 'Desea confirmar la cita?<br><br>' + nombrePaciente + '<br><br>' + tels,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Sí',
          handler: async () => {
            const loading = await this.loadingController.create({
              spinner: 'crescent'
            });
            loading.present().then(() => {
              this.restApiService.getCita(cita._id).then((cita: any) => {
                if (cita != null) {
                  console.log(cita);
                  cita._rev = null;
                  cita.estado = 'CONFIRMADA';
                  cita.sincronizado = true;
                  this.restApiService.guardarCita(cita, (res) => {
                    console.log('cita almacenada', res);
                    if (res === true) {
                      loading.dismiss();
                      location.reload();
                    } else {
                      console.log('error al almacenar la cita editada');
                    }
                  });
                } else {
                  console.log('error de almacenar la cita');
                }
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }


  /**
   * funcion para mostrar las citas de emergencia
   */
  mostrarCitasEmergencia() {
    this.mostrarEmergencias = !this.mostrarEmergencias;
    if (this.mostrarEmergencias) {
      this.listaCitas = this.citaSinAgenda;
    } else {
      this.listaCitas = this.originalCitas;
      if (this.filtros !== undefined) {
        this.filtradoListado(this.filtros);
      }
    }
  }

}
