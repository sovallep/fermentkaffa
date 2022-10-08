import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService, PostFermentacion } from '../services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fermentaciones',
  templateUrl: './fermentaciones.page.html',
  styleUrls: ['./fermentaciones.page.scss'],
})
export class FermentacionesPage implements OnInit {
  tabla = "fermentaciones";
  nanolote = [];
  fermentacion = [];

  post: PostFermentacion = {
    nombre: "",
    descripcion: "",
    id_nano_lote: 0,
    id_tipo_fermentacion: 0,
    fecha_registro: null,
    peso_libras_nanolote: 0.00,
    ph_inicial: 0.00,
    nivel_azucar_inicial: 0.00
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

  cleanPost() {
    this.post = {
      nombre: "",
      descripcion: "",
      id_nano_lote: 0,
      id_tipo_fermentacion: 0,
      fecha_registro: null,
      peso_libras_nanolote: 0.00,
      ph_inicial: 0.00,
      nivel_azucar_inicial: 0.00
    };
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
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('tipos-fermentacion').subscribe((res: any) => {
        if (res) {
          this.fermentacion = res.data;
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('nano-lotes').subscribe((res: any) => {
        if (res) {
          this.nanolote = res.data;
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }


  addProduct() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = false;
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
          this.isDisplay = true
          this.cleanPost();
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
      descripcion: this.post.descripcion,
      id_nano_lote: this.post.id_nano_lote,
      id_tipo_fermentacion: this.post.id_tipo_fermentacion,
      peso_libras_nanolote: this.post.peso_libras_nanolote,
      fecha_registro: this.post.fecha_registro,
      ph_inicial: this.post.ph_inicial,
      nivel_azucar_inicial: this.post.nivel_azucar_inicial,
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
          message: 'Eliminando Tipo de fermentacion id: ' + id,
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
      descripcion: item.attributes.descripcion,
      id_nano_lote: item.attributes.id_nano_lote,
      id_tipo_fermentacion: item.attributes.id_tipo_fermentacion,
      fecha_registro: item.attributes.fecha_registro,
      peso_libras_nanolote: item.attributes.peso_libras_nanolote,
      ph_inicial: item.attributes.ph_inicial,
      nivel_azucar_inicial: item.attributes.nivel_azucar_inicial
    }
    this.userId = id;
    this.isDisplay = false
  }

}
