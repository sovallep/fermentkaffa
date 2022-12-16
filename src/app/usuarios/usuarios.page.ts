import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
export interface Post {
  AboutMe: string;
  PostalCode: string;
  Country: string;
  City: string;
  Adress: string;
  LastName: string;
  FistName: string;
  email: string;
  Username: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  post: Post = {
    AboutMe: '',
    PostalCode: '',
    Country: '',
    City: '',
    Adress: '',
    LastName: '',
    FistName: '',
    email: '',
    Username: ''
  };

  constructor(
    public loadingController: LoadingController,
  ) { }


  ngOnInit() {
  }

  verimg() {
    Swal.fire({
      width: 400,
      imageUrl: 'assets/img/logo2.jpeg',
      showConfirmButton: true
    });
  }
}




