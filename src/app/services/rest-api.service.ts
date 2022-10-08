import { HttpClient } from '@angular/common/http';
import { NetworkService } from './network.service';
import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';
import { httpConstants } from '../app-constants';
import { getTestBed } from '@angular/core/testing';
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
  fecha_registro: Date;
  peso_libras_nanolote: number;
  ph_inicial: number;
  nivel_azucar_inicial: number;
}


@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  public pdb;
  url = httpConstants.test.api;
  // url = httpConstants.development.api;

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

}
