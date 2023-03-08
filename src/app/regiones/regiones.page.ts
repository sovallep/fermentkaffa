import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { RestApiService, PostReg } from '../services/rest-api.service';
import { httpConstants } from '../app-constants';
import { HttpClient } from '@angular/common/http';

declare var google;
@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.page.html',
  styleUrls: ['./regiones.page.scss'],
})
export class RegionesPage implements OnInit {
  deptos = ['Sacatepéquez'];
  munis = ['Antigua Guatemala', 'Jocotenango', 'Pastores', 'Sumpango', 'Santo Domingo Xenacoj', 'Santiago Sacatepequez', 'San Bartolomé Milpas Altas', 'San Lucas Sacatepequez', 'Santa Lucía Milpas Altas', 'Magdalena Milpas Altas', 'Santa María de Jesús', 'Ciudad Vieja', 'San Miguel Dueñas', 'San Juan Alotenango', 'San Antonio Aguas Calientes', 'Santa Catarina Barahona'];
  tabla = "Regiones";
  post: PostReg = {
    nombre: "",
    finca: "",
    departamento: "",
    municipio: "",
    altura: 0
  };
  user = [];
  isDisplay = true;
  userItem: [];
  userId: -1;

  url = httpConstants.development.api;

  constructor(
    private restApiService: RestApiService,
    private loadingController: LoadingController,
    private httpClient: HttpClient,
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
          this.user = res;
          this.drawChart();
          loading.dismiss();
        } else {
          loading.dismiss();
        }
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Lat', 'Long', 'City', 'ID'],
      [14.5497843, -90.8866591, 'Sacatepequez', 100],
      [14.5591436, -90.7513298, 'Antigua Guatemala 1530 Metros', 1],
      [14.5234357, -90.7733775, 'Ciudad Vieja, 1550 Metros', 1],
      [14.5795747, -90.7610396, 'Jocotenango 1546 Metros', 1],
      [14.5472808, -90.6782881, 'Magdalena Milpas Altas 2127 Metros', 1],
      [14.6004318, -90.7667041, 'Pastores 1750 Metros', 1],
      [14.5509945, -90.8020659, 'San Antonio Aguas Calientes 1530 Metros', 1],
      [14.6084493, -90.6865975, 'San Bartolomé Milpas Altas 2090 Metros', 1],
      [14.4846403, -90.8133317, 'San Juan Alotenango 1376 Metros', 1],
      [14.6081228, -90.6695788, 'San Lucas Sacatepéquez 2100 Metros', 1],
      [14.5208601, -90.8055317, 'San Miguel Dueñas 1462 Metros', 1],
      [14.5538231, -90.7931399, 'Santa Catarina Barahona 1520 Metros', 1],
      [14.5779916, -90.6814653, 'Santa Lucía Milpas Altas 1970 Metros', 1],
      [14.4932934, -90.7181025, 'Santa María de Jesús 2070 Metros', 1],
      [14.6354334, -90.6838242, 'Santiago Sacatepéquez 2040 Metros', 1],
      [14.681952, -90.7096268, 'Santo Domingo Xenacoj 1832 Metros', 1],
      [14.647721, -90.7425428, 'Sumpango 1900 Metros', 1],
    ]);

    var options = {
      region: 'GT',
      displayMode: 'markers',
      colorAxis: { colors: ['#00853f', 'black', '#e31b23'] },
      backgroundColor: '#81d4fa',
      datalessRegionColor: '#f8bbd0',
      defaultColor: '#f5f5f5',
      showTooltip: true,
      showInfoWindow: true,
      useMapTypeControl: true,

    };

    var chart = new google.visualization.GeoChart(document.getElementById('regiones'));
    chart.draw(data, options);

  }


  addProduct() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = false;
  }

  cleanPost() {
    this.post = {
      nombre: "",
      finca: "",
      departamento: "Sacatepéquez",
      municipio: "San Juan Alotenango",
      altura: 0
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
      this.restApiService.postAddItem(this.tabla, this.post).subscribe((res: any) => {
        loading.dismiss();
        this.userItem = [];
        this.cleanPost();
        this.isDisplay = true;
        this.log();
      }), (error: any) => {
        console.log(error);
        loading.dismiss();
      }
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
    let temp = {
      id: this.user[this.userId].id,
      nombre: this.post.nombre,
      finca: this.post.finca,
      departamento: this.post.departamento,
      municipio: this.post.municipio,
      altura: this.post.altura
    }
    await loading.present().then(() => {
      this.restApiService.putEditItem(this.tabla, temp, this.user[this.userId].id).subscribe((res: any) => {
        loading.dismiss(); 
        this.userItem = [];
          this.userId = -1;
          this.isDisplay = true
          this.cleanPost();
          this.log();
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
              this.user.splice(index, 1);
              loading.dismiss();
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
    this.post = {
      nombre: item.nombre,
      finca: item.finca,
      departamento: item.departamento,
      municipio: item.municipio,
      altura: item.altura
    }
    this.userId = id;
    this.isDisplay = false
  }

}

