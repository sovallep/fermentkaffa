import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService } from './network.service';
import { Injectable } from '@angular/core';
import { httpConstants } from '../app-constants';
import { DatetimeOptions } from '@ionic/core';
import { Time } from '@angular/common';
export interface PostF {
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
  url = httpConstants.development.api;

  constructor(
    private networkService: NetworkService,
    private httpClient: HttpClient,
  ) { }

  getListado(item) {
    const url = this.url + 'get' + item + '.php';
    const listado = this.httpClient.get(url);
    return listado;
  }

  deleteListadoItem(item, id) {
    const url = this.url + 'delete' + item + '.php';
    return this.httpClient.delete(url + '/?id=' + id);
  }

  postAddItem(item: string, data: object) {
    const jsonNew = JSON.stringify(data);
    const url = this.url + 'post' + item + '.php';
    return this.httpClient.post(url, jsonNew);
  }

  putEditItem(item: string, data: object, id: number) {
    const jsonNew = JSON.stringify(data);
    const url = this.url + 'put' + item + '.php';
    return this.httpClient.put(url + '/?id=' + id, jsonNew );
  }

}
