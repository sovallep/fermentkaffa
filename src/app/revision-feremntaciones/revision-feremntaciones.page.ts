import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService, RevFermentacion } from '../services/rest-api.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Time } from '@angular/common';
declare var google;

@Component({
  selector: 'app-revision-feremntaciones',
  templateUrl: './revision-feremntaciones.page.html',
  styleUrls: ['./revision-feremntaciones.page.scss'],
})
export class RevisionFeremntacionesPage implements OnInit {

  tabla = "revision-ferementaciones";

  post: RevFermentacion = {
    notas: "",
    id_fermentacion: 0,
    horas_transcurridas: 0,
    fecha: null,
    hora: null,
    ph: 0,
    azucar: 0
  };

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    watchSlidesProgress: true,
  };

  idFermentacion = null;
  user = [];
  revisiones = [];
  isDisplay = true;
  userItem: [];
  userId: -1;

  constructor(
    private restApiService: RestApiService,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
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
      this.restApiService.getListado(this.tabla).subscribe((res: any) => {
        if (res) {
          this.route.queryParams.subscribe((params: any) => {
            if (params.id) {
              let array = res.data;
              array.forEach(element => {
                if (element.attributes.id_fermentacion == params.id) {
                  this.idFermentacion = params.id;
                  this.revisiones.push(element);
                }
              });
              loading.dismiss();
              this.drawVisualization(this.revisiones);
              this.drawChart(this.revisiones);
            }
          });
        } else {
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  drawVisualization(datos) {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Horas');
    data.addColumn('number', 'Ph');
    data.addColumn('number', 'Grados Brix');
    datos.forEach(element => {
      console.log(element);
      data.addRows([[element.attributes.horas_transcurridas, element.attributes.ph, element.attributes.azucar]]);
    });
    var options = {
      vAxis: { title: 'Grados' },
      hAxis: { title: 'Horas' },
      seriesType: 'bars',
      series: { 2: { type: 'line' } }
    };
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  drawChart(datos) {
    console.log(datos);
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Horas');
    data.addColumn('number', 'Ph');
    data.addColumn('number', 'Grados Brix');
    datos.forEach(element => {
      console.log(element);
      data.addRows([[element.attributes.horas_transcurridas, element.attributes.ph, element.attributes.azucar]]);
    });
    var options = {
      vAxis: {
        title: 'Grados'
      },
      hAxis: {
        title: 'Horas'
      },
      series: {
        1: { curveType: 'function' }
      }
    };
    var chart = new google.visualization.LineChart(document.getElementById('lineas'));
    chart.draw(data, options);
  }

  addProduct() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = false;
  }

  cleanPost() {
    this.post = {
      notas: "",
      id_fermentacion: 0,
      horas_transcurridas: 0,
      fecha: null,
      hora: null,
      ph: 0,
      azucar: 0
    };
  }

  back() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = true
  }

  onSubmit() {
    // editar uno existente
    if (this.userId != null && this.userId >= 0) {
      console.log('entro editar');
      this.update();
    } else { // crear un nuevo 
      console.log('entro nuevo item');
      this.save();
    }
  }

  async save() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      let idfer = parseInt(this.idFermentacion, 10);
      this.post.id_fermentacion = idfer;
      this.restApiService.postAddItem(this.tabla, this.post).subscribe((res: any) => {
        console.log(res);
        if (res.data.id) {
          this.userItem = [];
          this.user = [];
          this.revisiones = [];
          this.cleanPost();
          this.isDisplay = true
          this.log();
          loading.dismiss();
        } else {
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  async update() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    let idfer = parseInt(this.idFermentacion, 10);
    let horaMins = this.post.hora;
    let temp = {
      id: this.userId,
      notas: this.post.notas,
      id_fermentacion: idfer,
      horas_transcurridas: this.post.horas_transcurridas,
      fecha: this.post.fecha,
      hora: horaMins,
      ph: this.post.ph,
      azucar: this.post.azucar
    }
    await loading.present().then(() => {
      this.restApiService.putEditItem(this.tabla, temp, this.userId).subscribe((res: any) => {
        console.log(res);
        if (res.data.id) {
          this.userItem = [];
          this.user = [];
          this.revisiones = [];
          this.userId = -1;
          this.isDisplay = true
          this.cleanPost();
          loading.dismiss();
          this.log();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  async remove(id, index) {
    Swal.fire({
      title: '¿Deseas eliminar este registro?',
      backdrop: 'rgba(0,0,0,0.5)',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loading = await this.loadingController.create({
          message: 'Eliminando Tipo de fermeentacion id: ' + id,
          spinner: 'crescent'
        });
        await loading.present().then(() => {
          this.restApiService.deleteListadoItem(this.tabla, id).subscribe((res: any) => {
            console.log(res);
            if (res) {
              this.user.splice(index, 1);
              loading.dismiss();
            }
          });
        }).catch((err) => {
          console.log(err);
          loading.dismiss();
        })
      }
    });
  }

  edit(item, id) {
    this.userItem = item;
    let idfer = parseInt(this.idFermentacion, 10);
    this.post = {
      notas: item.attributes.notas,
      id_fermentacion: idfer,
      horas_transcurridas: item.attributes.horas_transcurridas,
      fecha: item.attributes.fecha,
      hora: item.attributes.hora,
      ph: item.attributes.ph,
      azucar: item.attributes.azucar
    }
    this.userId = item.id;
    this.isDisplay = false
  }

}

