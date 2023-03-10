import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  tabla = "regiones";
  regiones = [];
  cafe = [];
  tfermentaciones = [];
  fermentaciones = [];
  nanolotes = [];

  constructor(
    private restApiService: RestApiService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.log();
  }

  async log() {
    const loading = await this.loadingController.create({
      message: 'Cargando Datos...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.getListado('Regiones').subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.regiones = res;
          loading.dismiss();
        } else {
          loading.dismiss();    
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    });
    await loading.present().then(() => {
      this.restApiService.getListado('Tipocafes').subscribe((res: any) => {
        if (res) {
          this.cafe = res;
          loading.dismiss();
        } else {
          loading.dismiss();    
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    });
    await loading.present().then(() => {
      this.restApiService.getListado('Tiposfermentacion').subscribe((res: any) => {
        if (res) {
          this.tfermentaciones = res;
          loading.dismiss();
        } else {
          loading.dismiss();    
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('Nanolotes').subscribe((res: any) => {
        if (res) {
          this.nanolotes = res;
          loading.dismiss();
        } else {
          loading.dismiss();    
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('Fermentaciones').subscribe((res: any) => {
        if (res) {
          this.fermentaciones = res;
          this.drawChart(this.fermentaciones);
          this.histrialFermentacionesInactivas(this.fermentaciones);
          loading.dismiss();
        } else {
          loading.dismiss();    
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    loading.dismiss();
  }

  drawChart(datos) {
    var container = document.getElementById('histrialFermentaciones');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Position' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    datos.forEach(item => {
      this.tfermentaciones.forEach(tf => {
        if (item.id_tipo_fermentacion === tf.id && item.activa == true) {
          dataTable.addRows([
            [tf.nombre + ' ' + tf.descripcion, item.nombre, new Date(item.fecha_registro), new Date(item.fecha_fin)]
          ]);
        }
      });
    });
    chart.draw(dataTable);
  }

  histrialFermentacionesInactivas(datos) {
    var container = document.getElementById('histrialFermentacionesInactivas');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Position' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    datos.forEach(item => {
      this.tfermentaciones.forEach(tf => {
        if (item.id_tipo_fermentacion === tf.id && item.activa == false) {
          dataTable.addRows([
            [tf.nombre + ' ' + tf.descripcion, item.nombre, new Date(item.fecha_registro), new Date(item.fecha_fin)]
          ]);
        }
      });
    });
    chart.draw(dataTable);
  }


  verimg() {
    Swal.fire({
      width: 400,
      imageUrl: 'assets/img/logo2.jpeg',
      showConfirmButton: true
    });
  }

  body = document.querySelector("body");
  modal = document.querySelector(".modal");
  modalButton = document.querySelector(".modal-button");
  closeButton = document.querySelector(".close-button");
  scrollDown = document.querySelector(".scroll-down");
  isOpened = false;

  openModal = () => {
    this.modal.classList.add("is-open");
    this.body.style.overflow = "hidden";
  };

  closeModal = () => {
    this.modal.classList.remove("is-open");
    this.body.style.overflow = "initial";
  };

}

