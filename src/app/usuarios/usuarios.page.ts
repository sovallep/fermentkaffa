import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { element } from 'protractor';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  
  todosLosUsuarios;
  boolActivateActions=0;
  

  constructor(
    public loadingController: LoadingController,
    private restApiService: RestApiService,
  ) { }

    actualizar(event){
      console.log('evento actualizar', event);
      event.target.complete();
      this.ngOnInit();
      localStorage.removeItem('actualizarListado');
    }


  ngOnInit() {
    this.actualizarUsuarios();
  }

async actualizarUsuarios(){
  const loading = await this.loadingController.create({
    message: 'Actualizando usuarios',
    spinner: 'crescent'
  });

  await loading.present().then(() => {
    this.restApiService.getUsuarios().then((usuarios: any) => {
      console.log('res: ', usuarios);
      this.todosLosUsuarios = usuarios;
      let allUsuarios = this.todosLosUsuarios;
      this.drawDetailTable(allUsuarios);
      setTimeout(() => {
        if(this.boolActivateActions===0){
          this.boolActivateActions++;
          this.setBtnActions();
        }
        this.getDataByClick(allUsuarios);
      }, 100);
    });
    loading.dismiss();
  });
}

  drawDetailTable(objData){
    let body = document.getElementById('tbody');
    let tempBody = ``; 

    if(objData){
      for(let key in objData){
        let valData = objData[key];
        console.log(valData);
        tempBody += `<tr id="${valData.id}" class="tdRegister" style="height: 40px;">
                      <td style="border:1px solid black;">${valData.doc.nombres} ${valData.doc.apellidos}</td>
                      <td style="border:1px solid black;">${valData.doc.nombreUsuario}</td>
                      <td style="border:1px solid black;">${valData.doc.rol}</td>
                      </tr>
                      `;
      }
    }else{
      tempBody += ` <tr>
                      <td colspan="7">
                        <br><ion-icon size="large" name="alert-circle-outline"></ion-icon>
                        <br>NO HAY INFORMACION PARA MOSTRAR
                      </td>
                    </tr>
                   `;
    }

    body.innerHTML = tempBody;
  }

  setBtnActions(){
    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', ()=>{
      this.validateData();
    }) 
  
    let btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', ()=>{
      this.deleteRegister();
    });
  }

  getDataByClick(allUsuarios){
    let tdRegister = document.querySelectorAll('.tdRegister');
    tdRegister.forEach((element) => {
      element.addEventListener('click', () => {
        let id = element.id;0
        for(let key in allUsuarios){
          let register = allUsuarios[key];

          if(register.id == id){

            (<HTMLInputElement>document.getElementById('idRev')).value = register.doc._rev;
            (<HTMLInputElement>document.getElementById('idRegister')).value = register.id;
            (<HTMLInputElement>document.getElementById('firstNames')).value = register.doc.nombres;
            (<HTMLInputElement>document.getElementById('secondNames')).value = register.doc.apellidos;
            (<HTMLInputElement>document.getElementById('userName')).value = register.doc.nombreUsuario;
            (<HTMLInputElement>document.getElementById('password')).value = register.doc.password;
            let selectRole = (<HTMLInputElement>document.getElementById('selectRole')).value = register.rol; 
          }
        }
      });
    });
  }

  validateData(){
    let idRev = (<HTMLInputElement>document.getElementById('idRev'));
    let idRegister = (<HTMLInputElement>document.getElementById('idRegister'));
    let firstNames = (<HTMLInputElement>document.getElementById('firstNames'));
    let secondNames = (<HTMLInputElement>document.getElementById('secondNames'));
    let userName = (<HTMLInputElement>document.getElementById('userName'));
    let password = (<HTMLInputElement>document.getElementById('password'));
    let selectRole = (<HTMLInputElement>document.getElementById('selectRole'))
  
    if(firstNames.value) firstNames.classList.remove('noData');
    if(secondNames.value) firstNames.classList.remove('noData');
    if(userName.value) firstNames.classList.remove('noData');
    if(password.value) firstNames.classList.remove('noData');
    
    if(firstNames.value && secondNames.value 
      && userName.value && password.value){
        let rev;
        let usuario;

        if(idRev.value){
          rev = idRev.value;
          this.restApiService.getUsuario(idRegister.value).then((res: any) =>{
            usuario = res;
          });
        }else{
          rev = null;
        }
        
        let id;

        if(idRegister.value){
          id = idRegister.value;
        }else{
          id = 'TEMP' + (new Date().getTime());
        }

        console.log(rev,id);
        usuario = {
          _rev: rev,
          _id: id,
          nombres: firstNames.value,
          apellidos: secondNames.value,
          nombreUsuario: userName.value,
          password: password.value,
          rol: selectRole.value
        };

        if(rev == null){
          delete usuario._rev;
        }

        console.log(usuario);
        this.restApiService.guardarUsuario(usuario).then((res) =>{
          console.log("Guardado");
          usuario = "";
          idRev.value = "";
          idRegister.value = "";
          firstNames.value = "";
          secondNames.value = "";
          userName.value = "";
          password.value = "";
          selectRole.value = "";
          this.actualizarUsuarios();
        }).catch((err) => {
          console.log('ocurrio un error', err);
        });
    }else{
      if(!firstNames.value) firstNames.classList.remove('noData');
      if(!secondNames.value) firstNames.classList.remove('noData');
      if(!userName.value) firstNames.classList.remove('noData');
      if(!password.value) firstNames.classList.remove('noData');
      if(!selectRole.value) firstNames.classList.remove('noData');
      
    }
  }

  deleteRegister(){
    let id = (<HTMLInputElement>document.getElementById('idRegister'));
    if (id.value) {
      console.log(id)
      this.restApiService.eliminarUsuario(id.value, (res: any) => {
        console.log(id.value, res);
        this.actualizarUsuarios(); 
      })
    }
  }

  }




