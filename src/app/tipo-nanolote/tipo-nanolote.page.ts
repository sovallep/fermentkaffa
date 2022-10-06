import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PostLotes, RestApiService } from '../services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-nanolote',
  templateUrl: './tipo-nanolote.page.html',
  styleUrls: ['./tipo-nanolote.page.scss'],
})
export class TipoNanolotePage implements OnInit {

  tabla = "nano-lotes";

  post: PostLotes = {
    nombre: "",
    descripcion: "",
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
          this.userId = -1;
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
      descripcion: item.attributes.descripcion,
    }
    this.userId = id;
    this.isDisplay = false
  }

}
