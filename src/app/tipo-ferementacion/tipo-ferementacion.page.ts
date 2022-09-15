import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-ferementacion',
  templateUrl: './tipo-ferementacion.page.html',
  styleUrls: ['./tipo-ferementacion.page.scss'],
})
export class TipoFerementacionPage implements OnInit {


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
    this.isDisplay = false;
  }

  back() {
    this.userItem = [];
    this.isDisplay = true
  }

  onSubmit() {
    // editar uno existente
    if (this.userItem != null && this.userItem != undefined) {
      this.user[this.userId] = JSON.parse(JSON.stringify(this.userItem))
      this.userItem = [];
    } else { // crear un nuevo 
      this.userItem = [];
    }
    this.log();
    this.isDisplay = true
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
    this.userId = id;
    this.isDisplay = false
  }

}
