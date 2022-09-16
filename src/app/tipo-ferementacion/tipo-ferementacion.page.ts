import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Post, RestApiService } from '../services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-ferementacion',
  templateUrl: './tipo-ferementacion.page.html',
  styleUrls: ['./tipo-ferementacion.page.scss'],
})
export class TipoFerementacionPage implements OnInit {

  post: Post = {
    nombre: "",
    descripcion: "",
  };
  user = [];
  isDisplay = true;
  userItem: [];
  userId: number;
  constructor(
    private restApiService: RestApiService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.log();
  }

  async log() {
    const loading = await this.loadingController.create({
      message: 'Actualizando catálogos',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.getListado('tipos-fermentacion').subscribe((res: any) => {
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
    this.post = {
      nombre: "",
      descripcion: ""
    }
    this.isDisplay = false;
  }

  back() {
    this.userItem = [];
    this.post = {
      nombre: "",
      descripcion: ""
    }
    this.isDisplay = true
  }

  onSubmit() {
    // editar uno existente
    if (this.userId != null && this.userId > 0) {
      this.user[this.userId] = JSON.parse(JSON.stringify(this.userItem))
      this.userItem = [];
      this.userId = 0;
      this.post = {
        nombre: "",
        descripcion: ""
      }
      this.isDisplay = true
    } else { // crear un nuevo 
      console.log('llego');
      this.save();
    }
  }

  async save() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.postAddItem('tipos-fermentacion', this.post).subscribe((res: any) => {
        console.log(res);
        if (res.data.id) {
          this.userItem = [];
          this.post = {
            nombre: "",
            descripcion: ""
          }
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
          this.restApiService.deleteListadoItem('tipos-fermentacion', id).subscribe((res: any) => {
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
      descripcion: item.attributes.descripcion
    }
    this.userId = id;
    this.isDisplay = false
  }

}
