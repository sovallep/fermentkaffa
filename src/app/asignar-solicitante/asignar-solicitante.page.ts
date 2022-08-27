import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, NavController, IonSearchbar } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-asignar-solicitante',
  templateUrl: './asignar-solicitante.page.html',
  styleUrls: ['./asignar-solicitante.page.scss'],
})
export class AsignarSolicitantePage implements OnInit {
  @ViewChild('searchBar', { static: false }) searchBar: IonSearchbar;
  form;
  doctores;
  resultados;
  servicios;
  tipoHorario;
  comprobantes = [];
  comprobante;
  // tslint:disable-next-line:variable-name
  _id;
  listaPacientes = [];

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private networkService: NetworkService,
    private restApiService: RestApiService) { }

  ngOnInit() {
    this.resultados = [];
    this.form = this.formBuilder.group({});
    this.form.addControl('primerNombre', new FormControl('', Validators.required));
    this.form.addControl('primerApellido', new FormControl('', Validators.required));
    this.form.addControl('telefonoCelular', new FormControl('', Validators.required));
    this.form.addControl('doctores', new FormControl('', Validators.required));
    this.form.addControl('segundoNombre', new FormControl(''));
    this.form.addControl('segundoApellido', new FormControl(''));
    this.form.addControl('telefonoCasa', new FormControl(''));
    this.form.addControl('servicio', new FormControl('', Validators.required));
    this.form.addControl('anotaciones', new FormControl(''));
    this.cargarDoctores();
  }

  /**
   * funcion que carga los datos de los doctores
   */
  async cargarDoctores() {
    const loading = await this.loadingController.create({
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      const citaJson = JSON.parse(localStorage.getItem('cita'));
      /**
       * Servicio de catalogo para obtener el listado de doctores
       */
      this.restApiService.getDoctores((doc: any) => {
        this.doctores = [];
        this.servicios = [];
        doc.forEach(doctor => {
          const sucursal = doctor.sucursals.find((sucursalIterada: any) => {
            return sucursalIterada.id === citaJson.ubicacion.id;
          });
          if (sucursal !== undefined) {
            this.doctores.push({ id: doctor.id, nombre: doctor.name, checked: citaJson.doctor.id === doctor.id });
            for (const servicio of doctor.services) {
              const existente = this.servicios.find((el: any) => {
                return el.id === servicio.id;
              });
              if (existente === undefined) {
                this.servicios.push({ id: servicio.id, nombre: servicio.name, checked: false });
              }
            }
          }
        });
        this.form.get('doctores').setValue('' + citaJson.doctor.id);
        loading.dismiss();
      });
    }).catch(() => {
      loading.dismiss();
    });
  }

  /**
   * funcion que carga los datos del doctor
   */
  elegirDoctor(id: number, event) {
    const checkeado = !event.target.checked; // se niega para tener valor verdadero
    const elegidos = this.form.get('doctores').value.trim();
    let listado = elegidos.split(',');
    if (elegidos === '') {
      listado = [];
    }
    if (checkeado) {
      const encontrado = listado.find((el) => {
        return parseInt(el, 10) === id;
      });
      if (encontrado === undefined) {
        listado.push(id);
      }
    } else {
      listado = listado.filter((el) => {
        return parseInt(el, 10) !== id;
      });
    }
    this.form.get('doctores').setValue(listado.join());
  }

  /**
   * funcion que carga el servicio
   */
  elegirServicio(idServicio, event) {
    this.form.get('servicio').setValue(idServicio);
  }

  /**
   * funcion para buscar el paciente
   */
  async buscarPaciente() {
    const loading = await this.loadingController.create({
      message: 'Buscando..',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      const term = this.searchBar.value;
      console.log("term", term);
      if (term.length > 2) {
        this.restApiService.buscarPacienteNombre(term).then((resultados) => {
          console.log(resultados);
          this.resultados = resultados;
          loading.dismiss();
          if (this.resultados.length === 0) {
            this.presentAlertNoResults();
          }
        });
      } else {
        this.resultados = [];
        loading.dismiss();
      }
    });
  }

  elegirPaciente(paciente) {
    console.log(paciente);
    this._id = paciente._id;
    this.form.get('primerNombre').setValue(paciente.primerNombre);
    this.form.get('primerNombre').disable({ onlySelf: true });
    this.form.get('segundoNombre').setValue(paciente.segundoNombre);
    this.form.get('segundoNombre').disable({ onlySelf: true });
    this.form.get('primerApellido').setValue(paciente.primerApellido);
    this.form.get('primerApellido').disable({ onlySelf: true });
    this.form.get('segundoApellido').setValue(paciente.segundoApellido);
    this.form.get('segundoApellido').disable({ onlySelf: true });
    this.form.get('telefonoCelular').setValue(paciente.telefonoCelular);
    this.form.get('telefonoCasa').setValue(paciente.telefonoCasa);
    this.resultados = [];
  }

  /**
   * funcion para limpiar los datos del paciente
   */
  resetPaciente() {
    this._id = undefined;
    this.form.get('primerNombre').setValue('');
    this.form.get('primerNombre').enable({ onlySelf: true });
    this.form.get('segundoNombre').setValue('');
    this.form.get('segundoNombre').enable({ onlySelf: true });
    this.form.get('primerApellido').setValue('');
    this.form.get('primerApellido').enable({ onlySelf: true });
    this.form.get('segundoApellido').setValue('');
    this.form.get('segundoApellido').enable({ onlySelf: true });
    this.form.get('telefonoCelular').setValue('');
    this.form.get('telefonoCasa').setValue('');
    this.resultados = [];
  }

  /**
   * funcion que retorna el id
   */
  getId() {
    const citaJson = JSON.parse(localStorage.getItem('cita'));
    const listaDoctores = this.form.get('doctores').value.split(',');
    const doctorPrincipal = listaDoctores[0];
    let id = citaJson.fecha.replace('-', '').replace('-', '');
    id += citaJson.id;
    id += ('000' + doctorPrincipal).slice(-4);
    return id;

  }

  /**
   * funcion que retorna los datos del old
   */
  setValues(old: any) {
    old.id = this.form.get('telefonoCelular').value;
    old.telefonoCelular = this.form.get('telefonoCelular').value;
    old.telefonoCasa = this.form.get('telefonoCasa').value;
    old.sincronizado = true;
    return old;
  }


  /**
   * metodo previo al guardado
   */
  handlePostSave(pacienteElegido: any, loading) {
    const citaJson = JSON.parse(localStorage.getItem('cita'));
    const listaDoctores = this.form.get('doctores').value.split(',');
    const doctorPrincipal = listaDoctores[0];
    let id = citaJson.fecha.replace('-', '').replace('-', '');
    id += citaJson.id;
    id += ('000' + doctorPrincipal).slice(-4);
    const doctorElegido = this.doctores.find((doctorIterado) => {
      return doctorIterado.id === parseInt(doctorPrincipal, 10);
    });
    const servicioElegido = this.servicios.find((servicioIterado) => {
      return servicioIterado.id === this.form.get('servicio').value;
    });
    const vacio = {
      id: 0,
      nombre: 'VACIO'
    };
    const fechaEnPartes = citaJson.fecha.split('-');
    const fechaString = fechaEnPartes[2] + '-' + fechaEnPartes[1] + '-' + fechaEnPartes[0];
    const logeado = JSON.parse(localStorage.getItem('logged'));
    const cita = {
      _id: id,
      doctor: doctorElegido,
      paciente: pacienteElegido,
      servicio: servicioElegido,
      especialidad: vacio,
      ubicacion: citaJson.ubicacion,
      estado: 'OCUPADO',
      fecha: fechaString,
      usuario: {
        //id: logeado.id,
        //nombre: logeado.username
      },
      sincronizado: true,
      comprobante: this.comprobante ? this.comprobante : 0,
      anotaciones: this.form.get('anotaciones').value,
      fechaRegistro: new Date().getTime()
    };
    cita.ubicacion.cambios = undefined;
    cita.ubicacion.apertura = undefined;
    cita.ubicacion.semana = undefined;
    this.restApiService.guardarCita(cita, (resCita: any) => {
      this.restApiService.guardarPaciente(pacienteElegido).then(() => {
      });
    });
    loading.dismiss();
    this.presentAlertConfirm();
    localStorage.setItem('actualizarListado', 'true');
  }

  /**
   * funcion que guarda al paciente
   */
  saveNewPatient(loading) {
    const citaJson = JSON.parse(localStorage.getItem('cita'));
    this.restApiService.obtenerYAumentarCorrelativo(citaJson.ubicacion.id, 'PACIENTE').then((docCorrelativo: any) => {
      const pacienteElegido = {
        _id: 'TEMP' + (new Date().getTime()),
        id: this.form.get('telefonoCelular').value,
        primerNombre: this.form.get('primerNombre').value,
        segundoNombre: this.form.get('segundoNombre').value,
        primerApellido: this.form.get('primerApellido').value,
        segundoApellido: this.form.get('segundoApellido').value,
        telefonoCelular: this.form.get('telefonoCelular').value,
        telefonoCasa: this.form.get('telefonoCasa').value,
        codigo: docCorrelativo.codigo + '' + docCorrelativo.correlativo
      }
      this.restApiService.guardarPaciente(pacienteElegido).then((res) => {
        this.handlePostSave(pacienteElegido, loading);
      }).catch(() => {
        console.log('ocurrio un error');
        loading.dismiss();
      });
    });
  }

  /**
   * funcion que guarda al paciente
   */
  async guardar() {
    const loading = await this.loadingController.create({
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      const citaId = this.getId();
      this.restApiService.getCita(citaId).then((dataCita: any) => {
        let flag = false;
        console.log('DEBUG ', dataCita);
        if (!dataCita) {
          flag = true;
        } else if (dataCita.estado === 'CANCELADA') {
          flag = true;
        }
        console.log('DEBUG ', flag);
        if (flag) {
          this.restApiService.getPaciente(this._id).then((document: any) => {
            if (document) {
              document = this.setValues(document);
              console.log(document);
              /**
               * servicio paciente para actualizar los datos
               */
              this.restApiService.guardarPaciente(document).then((res) => {
                this.handlePostSave(document, loading);
              });
            } else {
              this.saveNewPatient(loading);
            }
          });
        } else {
          loading.dismiss();
          this.presentWarningAlert();
        }
      });
    });
  }

  /**
   * mensaje de cita almacenada
   */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Cita Almacenada!',
      message: '<strong>La cita se ha almacenado</strong>',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                defaultSucursal: false
              }
            };
            localStorage.setItem('actualizarListado', 'true');
            this.navController.navigateRoot(['/agenda']);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * mensaje de alerta de horarios ocupados
   */
  async presentWarningAlert() {
    const nombrePaciente = this.form.get('primerNombre').value + ' ' + this.form.get('primerApellido').value;
    const telefonoPaciente = this.form.get('telefonoCelular').value;
    const alert = await this.alertController.create({
      header: 'Horario ocupado',
      // tslint:disable-next-line: max-line-length
      message: '<strong>El horario en el que intenta agregar la cita esta ocupado por otro paciente, por favor intente en un horario diferente, los datos del paciente son :\n Nombre : ' + nombrePaciente + '\n Telefono: ' + telefonoPaciente + '</strong>',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            localStorage.setItem('actualizarListado', 'true');
            this.navController.navigateRoot(['/agenda']);
          }
        }
      ]
    });
    await alert.present();
  }

  backParam() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        reload: true
      }
    };
    localStorage.setItem('actualizarListado', 'true');
    this.navController.navigateRoot(['/agenda'], navigationExtras);

  }

  /**
   * funcion para regresar a la ventana anterior
   */
  regresar() {
    this.navController.pop();
  }

  changeComprobante(event) {
    this.comprobante = event.value;
  }

  /**
   * mensaje de error de busqueda
   */
  async presentAlertNoResults() {
    const alert = await this.alertController.create({
      header: '',
      message: 'No hay coincidencias para la búsqueda',
      buttons: ['Entiendo']
    });
    await alert.present();
  }

  /**
   * funcion que inicializa la lista de pacientes
   */
  async inicializarListaPacientes() {
    const loading = await this.loadingController.create({
      message: 'Cargando Pacientes ...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      // this.pacienteService.obtenerIndicePacientes().then((data: any) => {
      // this.listaPacientes = data;
      loading.dismiss();
      // });
    });
  }

}
