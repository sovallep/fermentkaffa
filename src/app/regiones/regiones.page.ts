import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { RestApiService, PostReg } from '../services/rest-api.service';

declare var google;
@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.page.html',
  styleUrls: ['./regiones.page.scss'],
})
export class RegionesPage implements OnInit {
  deptos = ['Sacatepéquez'];
  munis = ['Antigua Guatemala', 'Jocotenango', 'Pastores', 'Sumpango', 'Santo Domingo Xenacoj', 'Santiago Sacatepequez', 'San Bartolomé Milpas Altas', 'San Lucas Sacatepequez', 'Santa Lucía Milpas Altas', 'Magdalena Milpas Altas', 'Santa María de Jesús', 'Ciudad Vieja', 'San Miguel Dueñas', 'San Juan Alotenango', 'San Antonio Aguas Calientes', 'Santa Catarina Barahona'];
  tabla = "regiones";
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
      this.restApiService.getListado(this.tabla).subscribe((res: any) => {
        if (res) {
          this.user = res.data;
          console.log(this.user);
          this.drawChart();
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  drawChart() {
    // this.user.forEach(item => {
    // this.tfermentaciones.forEach(tf => {
    // if (item.attributes.id_tipo_fermentacion === tf.id) {
    //   dataTable.addRows([
    //     [tf.attributes.nombre + ' ' + tf.attributes.descripcion, item.attributes.nombre, new Date(item.attributes.fecha_registro), new Date(item.attributes.fecha_fin)]
    //   ]);
    // }
    // });
    // });

    var data = google.visualization.arrayToDataTable([
      ['Lat', 'Long', 'City', 'ID'],
      [14.5497843,-90.8866591, 'Sacatepequez', 100],
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
      [14.647721,-90.7425428, 'Sumpango 1900 Metros', 1],
    ]);

    var options = {
      // region: '013', // CENTRO AMERICA GT-SA GT-03
      region: 'GT',
      // displayMode: 'text',
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
      departamento: "",
      municipio: "",
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
        console.log(res);
        if (res.data.id) {
          this.userItem = [];
          this.cleanPost();
          this.isDisplay = true
          this.log();
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
        console.log(res);
        if (res.data.id) {
          this.userItem = [];
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
    this.post = {
      nombre: item.attributes.nombre,
      finca: item.attributes.finca,
      departamento: item.attributes.departamento,
      municipio: item.attributes.municipio,
      altura: item.attributes.altura
    }
    this.userId = id;
    this.isDisplay = false
  }

}

