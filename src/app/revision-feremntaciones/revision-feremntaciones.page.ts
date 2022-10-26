import { Component, OnInit } from '@angular/core';
import { PostReg, RestApiService } from '../services/rest-api.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revision-feremntaciones',
  templateUrl: './revision-feremntaciones.page.html',
  styleUrls: ['./revision-feremntaciones.page.scss'],
})
export class RevisionFeremntacionesPage implements OnInit {
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

