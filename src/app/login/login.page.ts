import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuController, LoadingController } from '@ionic/angular';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginFormGroup: FormGroup;
  public errorMessage: string;
  event: any;

  constructor(
    private formBuilder: FormBuilder,
    private menuController: MenuController,
    private restApiService: RestApiService,
    private loadingController: LoadingController,
    private router: Router,
    private translateService: TranslateService,
    private appComponent: AppComponent,
  ) {
    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
  }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
    const lang = JSON.parse(localStorage.getItem('lang'));
    if (lang != null) {
      this.translateService.use(lang);
      console.log('Lang:' + lang);
    }
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
    if (localStorage.getItem('logged') !== null) {
      // this.event.publish('userLogged', JSON.parse(localStorage.getItem('logged')));
      this.router.navigate(['/home']);
      this.menuController.enable(true);
    }
  }

  validate() {
    this.errorMessage = undefined;
    const data = {
      username: this.loginFormGroup.get('user').value,
      password: this.loginFormGroup.get('password').value,
    };
    this.authenticate(data, true);
  }

  async authenticate(data, firstLogin) {
    const loading = await this.loadingController.create({
      message: 'Autenticando..',
      spinner: 'dots',
      cssClass: 'mensajeCarga'
    });
    await loading.present().then(() => {
      if (data.username === 'admin') {
        if (data.password === 'admin') {
              this.menuController.enable(true);
          this.router.navigate(['/home']);
          loading.dismiss();
        }
        loading.dismiss();
      } else {
        this.errorMessage = 'Usuario o contraseña invalidos';
        loading.dismiss();
      }
      // this.restApiService.authenticate(data).then((response: any) => {
      //   const valid = response.datos.valid;
      //   if (valid === true) {
      //     if (firstLogin) {
      //       const dataLogin = {
      //         id: response.datos.idUser,
      //         username: this.loginFormGroup.get('user').value,
      //         roles: response.datos.rols,
      //         doctor: response.datos.doctor,
      //         sucursales: response.datos.sucursales,
      //         sucursal: response.datos.sucursal_default
      //       };
      //       // this.event.publish('userLogged', dataLogin);
      //     } else {
      //     }
      //     loading.dismiss();
      //     this.router.navigate(['/home']);
      //   } else {
      //     this.errorMessage = 'Usuario o contraseña invalidos';
      //   }
      // }).catch((error)=>{
      //   console.log('error de validacion',error);
      //   loading.dismiss();
      // });
    });
  }

}
