import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  tabla = "regiones";
  regiones = [];
  cafe = [];
  tfermentaciones = [];
  nanolotes = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

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
      this.restApiService.getListado('regiones').subscribe((res: any) => {
        if (res) {
          this.regiones = res.data;
          console.log(this.regiones.length);
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('tipo-cafes').subscribe((res: any) => {
        if (res) {
          this.cafe = res.data;
          console.log(this.cafe.length);
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
          this.tfermentaciones = res.data;
          console.log(this.tfermentaciones.length);
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
          this.nanolotes = res.data;
          console.log(this.nanolotes.length);
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  verimg() {
    Swal.fire({
      width: 400,
      imageUrl: 'assets/img/logo2.jpeg',
      showConfirmButton: true
    });
  }

  body = document.querySelector("body");
  modal = document.querySelector(".modal");
  modalButton = document.querySelector(".modal-button");
  closeButton = document.querySelector(".close-button");
  scrollDown = document.querySelector(".scroll-down");
  isOpened = false;

  openModal = () => {
    this.modal.classList.add("is-open");
    this.body.style.overflow = "hidden";
  };

  closeModal = () => {
    this.modal.classList.remove("is-open");
    this.body.style.overflow = "initial";
  };

}

