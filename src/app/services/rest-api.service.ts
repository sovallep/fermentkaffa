import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService } from './network.service';
import { Injectable } from '@angular/core';
import { httpConstants } from '../app-constants';
import { DatetimeOptions } from '@ionic/core';
import { Time } from '@angular/common';
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


export interface PostLotes {
  id?: string;
  nombre: string;
  descripcion: string;
  id_region: number;
  id_tipo_cafe: number;
}

export interface PostFermentacion {
  id?: string;
  nombre: string;
  descripcion: string;
  id_tipo_fermentacion: number;
  id_nano_lote: number;
  fecha_registro: DatetimeOptions;
  fecha_fin: DatetimeOptions,
  activa: boolean,
  peso_libras_nanolote: number;
  ph_inicial: number;
  nivel_azucar_inicial: number;
}

export interface RevFermentacion {
  id?: string;
  notas: string;
  id_fermentacion: number;
  horas_transcurridas: number;
  fecha: DatetimeOptions;
  hora: Time,
  ph: number;
  azucar: number;
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  headers: HttpHeaders;
  public pdb;
  // url = httpConstants.test.api;
  url = httpConstants.development.api;

  constructor(
    private networkService: NetworkService,
    private httpClient: HttpClient,
  ) {
    this.headers = new HttpHeaders();
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
   }

  getListado(item) {
    const url = this.url + 'get' + item + '.php';
    console.log(url);
    const listado = this.httpClient.get(url);
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

}
