import { ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RestApiService } from '../services/rest-api.service';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ListaAgendaComponent } from '../components/lista-agenda/lista-agenda.component';
import { ActivatedRoute } from '@angular/router';
import { AnioMesModalPage } from '../anio-mes-modal/anio-mes-modal.page';
import { CitaDisponiblePage } from '../cita-disponible/cita-disponible.page';

class Doctor {
  public id: number;
  public name: string;
}
class Hour {
  public id: number;
  public name: string;
  public time: string;
}
class Sucursal {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  @Input() fecha;

  doctor: Doctor;
  hour: Hour;
  sucursal: Sucursal;
  disponibles: any;
  filtroDisponibles = false;
  listaCitasDoctor;
  todosLosDoctores;
  fecha1;
  currentMonth: number;
  currDate: Date;
  currentMonthStr: string;
  citasCercanas = [];
  defaultSucursal = true;
  selectCombos = {};
  primerCarga = true;
  paramHorariosSabados;

  @ViewChild('hourSelect', { static: true }) hourSelect: IonicSelectableComponent;
  @ViewChild('doctorSelect', { static: true }) doctorSelect: IonicSelectableComponent;
  @ViewChild('sucursalSelect', { static: true }) sucursalSelect: IonicSelectableComponent;
  @ViewChild('listaAgenda', { static: true }) listaAgenda: ListaAgendaComponent;
  @ViewChild(CalendarComponent, { static: true }) agendaCalendar: CalendarComponent;

  public dataArray = {
    hour: [],
    doctor: [],
    sucursal: [],
  };

  namesPlural = {
    hour: 'hours',
    doctor: 'doctors',
    sucursal: 'sucursals',
  };

  namesSingular = {
    hours: 'hour',
    doctors: 'doctor',
    sucursals: 'sucursal',
  };

  filterObj = {
    hour: {},
    doctor: {},
    sucursal: {}

  };
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-GT'
  };

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    public cdr: ChangeDetectorRef,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private restApiService: RestApiService,
    private route: ActivatedRoute,
  ) {
    // this.route.queryParams.subscribe(params => {
    //   const val = params.defaultSucursal;
    //   this.defaultSucursal = val ? (val === 'true' ? true : false) : true;
    // });
    const fecha = new Date();
    for (let i = 0; i < 30; i = i + 3) {
      fecha.setDate(fecha.getDate() + i);
      const formatDate = ('0' + fecha.getDate()).slice(-2) + '/' + ('0' + (fecha.getMonth() + 1)).slice(-2)
        + '/' + fecha.getFullYear();
      this.citasCercanas.push({
        fecha: formatDate,
        hora: Math.round(Math.random() * 10 + 8),
      });
    }
  }

  actualizar(event) {
    console.log('evento actualizar', event);
    event.target.complete();
    this.listaAgenda.sync();
    localStorage.removeItem('actualizarListado');
  }

  ionViewWillEnter() {
    this.listaAgenda.sync();
    this.actualizarCatalogos();
    this.fixHeight();
    this.selectCombos = {
      hour: this.hourSelect,
      doctor: this.doctorSelect,
      sucursal: this.sucursalSelect,
    };
    this.loadDataForFilters(false).then(() => {
      if (localStorage.getItem('nuevaCita') !== null) {
        const nuevaCita = JSON.parse(localStorage.getItem('nuevaCita'));
        this.fecha1 = nuevaCita.fecha;
        this.calendar.currentDate = new Date(this.fecha1);
        this.calendar.currentDate.setDate(this.calendar.currentDate.getDate() + 1);
        this.currDate = this.calendar.currentDate;
        localStorage.removeItem('nuevaCita');
        this.doctorSelect._emitValueChange();
        this.sucursalSelect._emitValueChange();
      } else {
        this.currDate = new Date();
        this.hourSelect._emitValueChange();
        this.sucursalSelect._emitValueChange();
      }
      this.currentMonth = this.currDate.getMonth();
      this.currentMonthStr = this.monthNames[this.currentMonth];
      console.log('current month', this.currDate);
      if (localStorage.getItem('actualizarListado') !== null) {
        this.listaAgenda.sync();
        localStorage.removeItem('actualizarListado');
      }
    });

  }

  ngOnInit() {
    this.actualizarCatalogos();
   }

  /**
   * funcion que actualiza los datos de catalogos
   */
  async actualizarCatalogos() {
    const loading = await this.loadingController.create({
      message: 'Actualizando catálogos',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.getDoctores((doctores: any) => {
        this.todosLosDoctores = doctores;
      });
      loading.dismiss();
    });
  }

  /**
   * funcion que limpia los filtros
   */
  limpiarFiltro(event, select) {
    this.filterObj[select] = {};
    this.listaAgenda.filtradoListado(this.filterObj);
    if (select !== 'hour') {
      this.loadDataForFilters(true);
    }
  }

  comboChange(
    event: {
      component: IonicSelectableComponent,
      value: any
    },
    select: string) {
    const getElement = this.selectCombos[select].value;
    if (!getElement) { return; }
    const objToFind = {
      id: getElement.id,
      name: getElement.name,
      minimo: getElement.minimo,
      maximo: getElement.maximo
    };
    this.createFilterObj(select, objToFind);
    const elementArray = this.dataArray[select];
    if (select === 'doctor') {
      this.dataArray.sucursal = getElement.sucursals;
    }
    else {
      this.getDataWithComboSelected(select, getElement.id);
    }
    console.log(this.filterObj);
    this.listaAgenda.filtradoListado(this.filterObj);
  }

  createFilterObj(select: string | number, obj: any) {
    this.filterObj[select] = obj;
  }

  getDataWithComboSelected(select: string | number, id: string) {
    if (select === 'hour') {
      return;
    }
    const doctorsArray = this.dataArray.doctor;
    const doctorsTemp = [];
    if (this.todosLosDoctores === undefined) {
      this.restApiService.getDoctores((doctores: any) => {
        this.todosLosDoctores = doctores;
        this.todosLosDoctores.forEach(element => {
          const array = element[this.namesPlural[select]];
          // tslint:disable-next-line: radix
          if (array.some(el => el.id === parseInt(id))) {
            doctorsTemp.push(element);
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                const obj = element[key];
                if (Array.isArray(obj) && key !== this.namesPlural[select]) {
                  this.updateArrayWithData(this.namesSingular[key], obj);
                }
              }
            }
          }
        });
      });
    } else {
      this.todosLosDoctores.forEach(element => {
        const array = element[this.namesPlural[select]];
        // tslint:disable-next-line: radix
        if (array.some(el => el.id === parseInt(id))) {
          doctorsTemp.push(element);
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const obj = element[key];
              if (Array.isArray(obj) && key !== this.namesPlural[select]) {
                this.updateArrayWithData(this.namesSingular[key], obj);
              }
            }
          }
        }

      });
    }
    this.dataArray.doctor = [];
    this.dataArray.doctor = doctorsTemp;
  }

  updateArrayWithData(key, data) {
    this.dataArray[key] = data;
  }


  fixHeight() {
    setTimeout(() => {
      const divs = document.getElementsByClassName('monthview-container');
      const length = divs.length;
      for (let index = 0; index < length; index++) {
        const div: any = divs[index];
        div.style = 'height: auto';
      }
    }, 100);
  }

  /**
   * funcion que carga los horarios diponibles
   */
  loadDataForFilters(limpiando: boolean) {
    return new Promise((resolve) => {
      let nuevaCita;
      if (localStorage.getItem('nuevaCita') !== null) {
        nuevaCita = JSON.parse(localStorage.getItem('nuevaCita'));
      }
      this.restApiService.getHours(data => {
        this.dataArray.hour = data;
        const horaActual = new Date().getHours();
        const horario = data.find((el: any) => {
          return el.name.toLowerCase().indexOf('todos') > -1 && el.maximo >= horaActual && el.minimo <= horaActual;
        });
        if (horario !== undefined) {
          this.hourSelect.value = horario;
        } else {
          this.hourSelect.value = { id: 6, name: 'Todos AM', minimo: 8, maximo: 11, time: 'AM' };
        }
        this.restApiService.getDoctores(dataDoctores => {
          dataDoctores = dataDoctores.filter((doctor) => {
            const atiende = doctor.sucursals.find((sucursal) => {
              return sucursal.id === 2;
            });
            return atiende !== undefined;
          });
          this.dataArray.doctor = dataDoctores;
          if (nuevaCita !== undefined) {
            this.doctorSelect.value = nuevaCita.doctor;
          }
          this.restApiService.getSucursales(dataSucursal => {
            console.log(dataSucursal);
            this.dataArray.sucursal = [];
            function isOptica(obj) {
              let str = obj.tipoSucursal;
              str = String(str);
              str = str.trim();
              str = str.toLowerCase();
              return str.indexOf('optica') > -1 || str.indexOf('óptica') > -1;
            }
            for (let idx = 0; idx < dataSucursal.length; idx++) {
              if (!isOptica(dataSucursal[idx])) {
                // const permiso = this.dataArray.sucursal.find((el: any) => {
                  // return el.id === 2;
                // });
                // if (permiso !== undefined) {
                  // this.dataArray.sucursal.push(dataSucursal[idx]);
                // }
              }
            }
            if (!limpiando) {
              console.log('load default ', this.defaultSucursal);
              if (this.defaultSucursal) {
                this.sucursalSelect.value = this.dataArray.sucursal.find((el: any) => {
                  return el.id === 2;
                });
              }
            }
            if (nuevaCita !== undefined) {
              this.sucursalSelect.value = nuevaCita.sucursal;
            }
          });
        });
      });
    });
    // });
  }

  /**
   * funcion que elimina los filtros
   */
  resetFilters() {
    for (const key in this.selectCombos) {
      if (this.selectCombos.hasOwnProperty(key)) {
        const element = this.selectCombos[key];
        element.value = null;
      }
    }
    this.loadDataForFilters(true);
    this.dataArray = {
      hour: [],
      doctor: [],
      sucursal: [],
    };
    this.filterObj = {
      hour: {},
      doctor: {},
      sucursal: {}
    };
    this.hour = null;
    this.doctor = null;
    this.sucursal = null;
    this.listaAgenda.filtradoListado(this.filterObj);
  }

  /**
   * funcion para elegir la fecha
   */
  elegirFecha1(fecha: Date) {
    let fechaTexto = fecha.getFullYear() + '-';
    fechaTexto += ('0' + (fecha.getMonth() + 1)).slice(-2) + '-';
    fechaTexto += ('0' + fecha.getDate()).slice(-2);
    this.fecha1 = fechaTexto;
    this.currentMonth = fecha.getMonth();
    this.currentMonthStr = this.monthNames[this.currentMonth];
    this.listaAgenda.sync();
  }

  async presentModalAnioMes() {
    const modal = await this.modalController.create({
      component: AnioMesModalPage,
      componentProps: {
        currentDate: this.calendar.currentDate,
        monthNames: this.monthNames
      },
      cssClass: 'modal-anio-mes'
    });
    modal.onDidDismiss().then(respuesta => {
      if (respuesta.data != null) {
        this.calendar.currentDate = new Date(respuesta.data.anio, respuesta.data.mes, 1);
      }
    });
    return await modal.present();
  }

  calendarDrop(event, direction) {
    // tslint:disable-next-line: no-string-literal
    const swiper = document.querySelector('.swiper-container')['swiper'];
    if (direction === 'right') {
      swiper.slideNext();
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
      } else {
        this.currentMonth++;
      }

    } else if (direction === 'left') {
      swiper.slidePrev();
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
      } else {
        this.currentMonth--;
      }
    }
    console.log(this.monthNames[this.currentMonth]);
    this.currentMonthStr = this.monthNames[this.currentMonth];
  }

  /**
   * funcion que busca las citas disponibles
   */
  async buscarDisponibles() {
    this.filtroDisponibles = true;
    const loading = await this.loadingController.create({
      message: 'Buscando citas disponibles',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      const sucursalElegida = this.dataArray.sucursal.find((el) => {
        return el.id === this.sucursal.id;
      });
      this.disponibles = [];
      if (this.doctor !== null) {
        if (this.sucursal !== null) {
          this.restApiService.obtenerCitasPorDoctor(this.doctor.id).then((ocupadas: any) => {
            let contadorAm = 0;
            let contadorPm = 0;
            let contadorDias = 0;
            const fechaHoy = new Date();
            let stringFechaHoy = fechaHoy.getFullYear() + ('0' + (fechaHoy.getMonth() + 1)).slice(-2);
            stringFechaHoy += ('0' + fechaHoy.getDate());
            const horasOcupadas = ocupadas.filter((cita: any) => {
              return cita._id >= stringFechaHoy;
            });
            while ((contadorAm < 5 || contadorPm < 5) && contadorDias < 30) {
              this.listaCitasDoctor = [];
              this.llenarHorasPorDoctor(this.doctor, sucursalElegida, fechaHoy, horasOcupadas);
              if (this.listaCitasDoctor.length > 0) {
                let fechaString = ('' + fechaHoy.getFullYear()) + ('0' + (fechaHoy.getMonth() + 1)).slice(-2);
                fechaString += ('0' + fechaHoy.getDate()).slice(-2);
                const horasAm = [9, 10, 11, 12, 13];
                const horasPm = [14, 15, 16, 17, 18];
                const minutos = ['00', '20', '40'];
                if (contadorAm < 5) {
                  horasAm.forEach(hora => {
                    minutos.forEach((minuto: string) => {
                      const libre = this.listaCitasDoctor.find((citaDoctor: any) => {
                        return citaDoctor.id === ('0' + hora).slice(-2) + minuto && citaDoctor.estado === 'LIBRE';
                      });
                      if (libre !== undefined && contadorAm < 5) {
                        const formatFecha = fechaString.substr(6, 2) + '/' + fechaString.substr(4, 2) + '/' + fechaString.substring(0, 4);
                        const idCita = fechaString + hora + minuto + ('000' + this.doctor.id).slice(-4);
                        const idH = ('0' + hora).slice(-2) + minuto;
                        if (hora < 13) {
                          this.disponibles.push({
                            fecha: formatFecha, hora: ('0' + hora).slice(-2) + ':' + minuto + ' AM', id: idCita,
                            idHora: idH
                          });
                        } else {
                          this.disponibles.push({
                            fecha: formatFecha, hora: '0' + (hora - 12) + ':' + minuto + ' PM', id: idCita,
                            idHora: idH
                          });
                        }
                        contadorAm++;
                      }
                    });
                  });
                }
                if (contadorPm < 5) {
                  horasPm.forEach(hora => {
                    minutos.forEach((minuto: string) => {
                      const libre = this.listaCitasDoctor.find((citaDoctor: any) => {
                        return citaDoctor.id === hora.toString() + minuto && citaDoctor.estado === 'LIBRE';
                      });
                      if (libre !== undefined && contadorPm < 5) {
                        const formatFecha = fechaString.substr(6, 2) + '/' + fechaString.substr(4, 2) + '/' + fechaString.substring(0, 4);
                        const idCita = fechaString + hora + minuto + ('000' + this.doctor.id).slice(-4);
                        const idH = ('0' + hora).slice(-2) + minuto;
                        this.disponibles.push({
                          fecha: formatFecha, hora: ('0' + (hora - 12)).slice(-2) + ':' + minuto + ' PM', id: idCita,
                          idHora: idH
                        });
                        contadorPm++;
                      }
                    });
                  });
                }
              }
              fechaHoy.setDate(fechaHoy.getDate() + 1);
              contadorDias++;
            }
            loading.dismiss();
            this.presentModal(sucursalElegida);
          });
          // });
        }
      }
    });
    loading.dismiss();
  }

  /**
   * funcion que llena las horas por doctor
   */
  llenarHorasPorDoctor(doctor: any, sucursal: any, fechaActual: Date, horasOcupadas: any) {
    const parsedDate = ('0' + fechaActual.getDate()).slice(-2) + '-' + ('0' + (fechaActual.getMonth() + 1)).slice(-2)
      + '-' + fechaActual.getFullYear();
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
            let idCita = parsedDate.split('-').reverse().join('');
            idCita += ('0' + Math.round(hora * 100)).slice(-4) + ('000' + doctor.id).slice(-4);
            const ocupada = horasOcupadas.find((el: any) => {
              return el._id === idCita;
            });
            if (ocupada === undefined) {
              this.agregarHoraLibre(hora, doctor, sucursal, parsedDate);
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
    console.log('aperturas', aperturas);
    if (aperturas !== undefined) {
      aperturas.forEach(apertura => {
        const horaIterada = apertura.dia[0].hora;
        const citasPorHora = [horaIterada, horaIterada + 0.2, horaIterada + 0.4];
        console.log('citas por Hora', citasPorHora);
        citasPorHora.forEach(hora => {
          console.log('horas ocupadas', horasOcupadas);
          let bloqueo;
          if (cambios.length > 0) { // hay cambios para este día
            bloqueo = cambios.find(b => {
              const horaInicioExcluir = new Date(b.fechaInicio).getUTCHours();
              const horaFinExcluir = new Date(b.fechaFinal).getUTCHours();
              return hora >= horaInicioExcluir && hora <= horaFinExcluir;
            });
          }
          if (bloqueo === undefined) {
            let idCita = parsedDate.split('-').reverse().join('');
            idCita += ('0' + Math.round(hora * 100)).slice(-4) + ('000' + doctor.id).slice(-4);
            const ocupada = horasOcupadas.find((el: any) => {
              return el._id === idCita;
            });
            if (ocupada === undefined) {
              this.agregarHoraLibre(hora, doctor, sucursal, parsedDate);
            }
          }
        });
      });
    }
  }

  /**
   * funcion que retorna de numeros a dias en letras
   */
  obtenerDiaSemana(fecha) {
    const weekday = new Array(7);
    weekday[0] = 'Domingo';
    weekday[1] = 'Lunes';
    weekday[2] = 'Martes';
    weekday[3] = 'Miercoles';
    weekday[4] = 'Jueves';
    weekday[5] = 'Viernes';
    weekday[6] = 'Sabado';
    return weekday[fecha.getDay()];
  }

  /**
   * funcion que agrega horas libres
   */
  agregarHoraLibre(hora, doctorElegido, sucursal, fechaActual) {
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
      fecha: fechaActual,
      estado: 'LIBRE'
    };
    this.listaCitasDoctor.push(libre);
  }

  async presentModal(paramSucursal: any) {
    const modal = await this.modalController.create({
      component: CitaDisponiblePage,
      componentProps: { doctor: this.doctor, sucursal: paramSucursal, disponibles: this.disponibles },
      cssClass: 'modal-citas-disponibles'
    });
    await modal.present();
  }

}
