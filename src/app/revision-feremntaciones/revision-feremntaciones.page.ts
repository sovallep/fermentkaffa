import { Component, OnInit } from '@angular/core';
import { RestApiService, RevFermentacion } from '../services/rest-api.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
declare var google;

@Component({
  selector: 'app-revision-feremntaciones',
  templateUrl: './revision-feremntaciones.page.html',
  styleUrls: ['./revision-feremntaciones.page.scss'],
})
export class RevisionFeremntacionesPage implements OnInit {

  tabla = "Revisionferementaciones";

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
  brixMax: number;
  phMax: number;

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
        this.route.queryParams.subscribe((params: any) => {
          if (params.id) {
            this.idFermentacion = params.id;
            let array = res;
            array.forEach(element => {
              if (element.id_fermentacion === params.id) {
                this.revisiones.push(element);
              }
            });
            loading.dismiss();
            console.log(this.revisiones);
            this.drawVisualization(this.revisiones);
            this.drawChart(this.revisiones);
            this.drawChart3(this.revisiones);
          }
        });
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  drawChart3(datos) {
    let phMayor = 0;
    let brixMayor = 0;
    datos.forEach(element => {
      const ph = parseFloat(element.ph);
      if (phMayor < ph) {
        phMayor = ph;
        this.phMax = phMayor;
      }
      const azucar = parseFloat(element.azucar);
      if (brixMayor < azucar) {
        brixMayor = azucar;
        this.brixMax = brixMayor;
      }
    });
    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Ph', phMayor],
      ['Brix', brixMayor]
    ]);
    var options = {
      width: 400, height: 120,
      yellowFrom: 0, yellowTo: 3,
      // greenFrom: 3, greenTo: 8,
      redFrom: 8, redTo: 100,
      minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('bouge'));
    chart.draw(data, options);
    setInterval(function () {
      datos.forEach(element => {
        const azucar = parseFloat(element.azucar);
        data.setValue(1, 1, 0 + azucar);
        chart.draw(data, options);
      });
    }, 7000);
    setInterval(function () {
      datos.forEach(element => {
        const ph = parseFloat(element.ph);
        data.setValue(0, 1, 0 + ph);
        chart.draw(data, options);
      });
    }, 5000);
  }

  drawVisualization(datos) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Horas');
    data.addColumn('number', 'Ph');
    data.addColumn('number', 'Grados Brix');
    datos.forEach(element => {
      const horas = parseInt(element.horas_transcurridas);
      const ph = parseFloat(element.ph);
      const azucar = parseFloat(element.azucar);
      data.addRows([[horas, ph, azucar]]);
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
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Horas');
    data.addColumn('number', 'Ph');
    data.addColumn('number', 'Grados Brix');
    datos.forEach(element => {
      const horas = parseInt(element.horas_transcurridas);
      const ph = parseFloat(element.ph);
      const azucar = parseFloat(element.azucar);
      data.addRows([[horas, ph, azucar]]);
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
      this.update();
    } else { // crear un nuevo 
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
        this.userItem = [];
        this.user = [];
        this.revisiones = [];
        this.cleanPost();
        this.isDisplay = true
        this.log();
        loading.dismiss();
      });
      loading.dismiss();
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
        this.userItem = [];
        this.user = [];
        this.revisiones = [];
        this.userId = -1;
        this.isDisplay = true
        this.cleanPost();
        loading.dismiss();
        this.log();
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  async remove(id, index) {
    console.log(id, index);
    Swal.fire({
      title: '¿Deseas eliminar este registro?',
      backdrop: 'rgba(0,0,0,0.5)',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loading = await this.loadingController.create({
          message: 'Eliminando revision id: ' + id,
          spinner: 'crescent'
        });
        await loading.present().then(() => {
          this.restApiService.deleteListadoItem(this.tabla, id).subscribe((res: any) => {
            this.revisiones.splice(index, 1);
            loading.dismiss();
          });
          loading.dismiss();
        }).catch((err) => {
          console.log(err);
          loading.dismiss();
        })
      }
    });
  }

  edit(item, id) {
    console.log(item, id);
    this.userItem = item;
    let idfer = parseInt(this.idFermentacion, 10);
    this.post = {
      notas: item.notas,
      id_fermentacion: idfer,
      horas_transcurridas: item.horas_transcurridas,
      fecha: item.fecha,
      hora: item.hora,
      ph: item.ph,
      azucar: item.azucar
    }
    this.userId = item.id;
    this.isDisplay = false
  }

}

