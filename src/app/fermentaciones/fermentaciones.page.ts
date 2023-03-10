import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService, PostFermentacion } from '../services/rest-api.service';
import Swal from 'sweetalert2';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-fermentaciones',
  templateUrl: './fermentaciones.page.html',
  styleUrls: ['./fermentaciones.page.scss'],
})
export class FermentacionesPage implements OnInit {
  tabla = "Fermentaciones";
  nanolote = [];
  fermentacion = [];

  post: PostFermentacion = {
    nombre: "",
    descripcion: "",
    id_nano_lote: 0,
    id_tipo_fermentacion: 0,
    fecha_registro: null,
    fecha_fin: null,
    activa: true,
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
    private router: Router,
  ) { }

  ngOnInit(
  ) {
    this.log();
  }

  cleanPost() {
    this.post = {
      nombre: "",
      descripcion: "",
      id_nano_lote: 0,
      id_tipo_fermentacion: 0,
      fecha_registro: null,
      fecha_fin: null,
      activa: true,
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
          this.user = res;
          console.log(this.user);
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
    await loading.present().then(() => {
      this.restApiService.getListado('Tiposfermentacion').subscribe((res: any) => {
        if (res) {
          this.fermentacion = res;
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
          this.nanolote = res;
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
        loading.dismiss();
        this.userItem = [];
        this.isDisplay = true
        this.cleanPost();
        this.log();
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
    let temp = {
      id: this.user[this.userId].id,
      nombre: this.post.nombre,
      descripcion: this.post.descripcion,
      id_nano_lote: this.post.id_nano_lote,
      id_tipo_fermentacion: this.post.id_tipo_fermentacion,
      peso_libras_nanolote: this.post.peso_libras_nanolote,
      fecha_registro: this.post.fecha_registro,
      fecha_fin: this.post.fecha_fin,
      activa: this.post.activa,
      ph_inicial: this.post.ph_inicial,
      nivel_azucar_inicial: this.post.nivel_azucar_inicial,
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
      loading.dismiss();
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
              this.user.splice(index, 1);
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
    this.userItem = item;
    this.post = {
      nombre: item.nombre,
      descripcion: item.descripcion,
      id_nano_lote: item.id_nano_lote,
      id_tipo_fermentacion: item.id_tipo_fermentacion,
      fecha_registro: item.fecha_registro,
      fecha_fin: item.fecha_fin,
      activa: item.activa,
      peso_libras_nanolote: item.peso_libras_nanolote,
      ph_inicial: item.ph_inicial,
      nivel_azucar_inicial: item.nivel_azucar_inicial
    }
    this.userId = id;
    this.isDisplay = false
  }

  revision(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['/revision-feremntaciones'], navigationExtras);
  }
}
