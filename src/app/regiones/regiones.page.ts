import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.page.html',
  styleUrls: ['./regiones.page.scss'],
})
export class RegionesPage implements OnInit {
  formRegion: FormGroup;
  formRegionActive = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
  ) { }



  ngOnInit() {
    this.formRegion = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      finca: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      altura: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      municipio: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      departamento: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });
  }

  guardar() {
    Swal.fire({
      title: 'Desea guardar la nueva region?',
      backdrop: 'rgba(0,0,0,0.5)',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Region Guardada!', '', 'success')
        console.log('guardar func', this.formRegion.value);
        this.formRegion.reset();
        this.formRegionActive = false;
      }
    });

  }

  cambioDepartamento() {
    if (this.formRegion.value.departamento != "" && this.formRegion.value.departamento != null && this.formRegion.value.departamento != undefined) {
      console.log('depto:', this.formRegion.value.departamento);
    }
  }

  AgregarRegion(val) {
    this.formRegionActive = val;
    if (val == false) {
      Swal.fire({
        title: 'Esta seguro?',
        text: 'Esto no sera reversible',
        backdrop: 'rgba(0,0,0,0.5)',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.formRegion.reset();
        } else {
          this.formRegionActive = true;
        }
      });
    }
  }
}

