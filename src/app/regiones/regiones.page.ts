import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.page.html',
  styleUrls: ['./regiones.page.scss'],
})
export class RegionesPage implements OnInit {

  // formRegion: FormGroup;
  // formRegionActive = false;

  regiones = [];
  userItem: [];
  isDisplay = true;
  userId: number;

  // constructor(
  //   private formBuilder: FormBuilder,
  // ) { }

  constructor(
    private restApiService: RestApiService,
    public loadingController: LoadingController,
    private toastCtrl: ToastController,
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
      this.restApiService.getListado('region').subscribe((res: any) => {
        if (res) {
          this.regiones = res.data;
          console.log(this.regiones);
        }
      });
      loading.dismiss();
    });
  }
  addProduct() {
    this.isDisplay = false;
  }

  back() {
    this.isDisplay = true
  }

  onSubmit() {
    // if (this.userId) this.userItem[this.userId] = JSON.parse(JSON.stringify(this.user))
    // else {
    //   this.userItem.push(JSON.parse(JSON.stringify(this.user)));
    // }
    // this.isDisplay = true
  }

  remove(id) {
    this.userItem.splice(id, 1);
  }

  edit(id) {
    // this.user = this.userItem[id];
    this.userId = id
    this.isDisplay = false
  }




  // ngOnInit() {
  //   this.formRegion = this.formBuilder.group({
  //     nombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
  //     finca: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
  //     altura: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
  //     municipio: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
  //     departamento: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
  //   });
  // }

  // guardar() {
  //   Swal.fire({
  //     title: 'Desea guardar la nueva region?',
  //     backdrop: 'rgba(0,0,0,0.5)',
  //     showDenyButton: true,
  //     confirmButtonText: 'Si',
  //     denyButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire('Region Guardada!', '', 'success')
  //       console.log('guardar func', this.formRegion.value);
  //       this.formRegion.reset();
  //       this.formRegionActive = false;
  //     }
  //   });

  // }

  // cambioDepartamento() {
  //   if (this.formRegion.value.departamento != "" && this.formRegion.value.departamento != null && this.formRegion.value.departamento != undefined) {
  //     console.log('depto:', this.formRegion.value.departamento);
  //   }
  // }

  // AgregarRegion(val) {
  //   this.formRegionActive = val;
  //   if (val == false) {
  //     Swal.fire({
  //       title: 'Esta seguro?',
  //       text: 'Esto no sera reversible',
  //       backdrop: 'rgba(0,0,0,0.5)',
  //       showDenyButton: true,
  //       confirmButtonText: 'Si',
  //       denyButtonText: 'No',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.formRegion.reset();
  //       } else {
  //         this.formRegionActive = true;
  //       }
  //     });
  //   }
  // }
}

