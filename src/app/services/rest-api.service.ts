import { HttpClient } from '@angular/common/http';
import { NetworkService } from './network.service';
import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';

export interface Post {
  id?: string;
  nombre: string;
  descripcion: string;
}
export interface PostCaf {
  id?: string;
  especie: string;
}

export interface PostReg {
  id?: string;
  nombre: string;
  finca: string;
  departamento: string;
  municipio: string;
  altura: number;
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  public pdb;
  url = 'http://localhost:1337/api/';
  constructor(
    private networkService: NetworkService,
    private httpClient: HttpClient,
  ) { }

  getListado(item) {
    const listado = this.httpClient.get(this.url + item);
    return listado;
  }

  deleteListadoItem(item, id) {
    const listado = this.httpClient.delete(this.url + item + '/' + id);
    return listado;
  }


  postAddItem(item: string, data: object) {
    return this.httpClient.post<Post[]>(this.url + item, {
      data
    });
  }

  putEditItem(item: string, data: object, id: number) {
    return this.httpClient.put<Post[]>(this.url + item + '/' + id, {
      data
    });
  }

  testConexion() {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
    db.allDocs({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log('result: ', result);
    }).catch(function (err) {
      console.log(err);
    });
  }

}
