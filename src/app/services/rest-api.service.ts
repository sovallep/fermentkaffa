import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  public pdb;

  constructor(
    private networkService: NetworkService,
    private httpClient: HttpClient,
    private toastController: ToastController
  ) { }

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

  private getDocument(docId, callback: any) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
    db.get(docId).then((doc: any) => {
      callback(doc.list);
    }).catch(err => {
      console.log(err);
      callback([]);
    });
  }

  getHours(callback: any) {
    this.getDocument('HORAS', callback);
  }

  getSucursales(callback: any) {
    this.getDocument('SUCURSALES', callback);
  }

  getDoctores(callback: any) {
    this.getDocument('DOCTORES', callback);
  }

  getPacientes() {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/pacientes');
      db.allDocs({
        include_docs: true,
      }).then((vista) => {
        const rows = vista.rows.filter((row: any) => {
          if (row.doc.id) {
            return row;
          }
        });
        console.log(rows);
        resolve(rows);
      }).catch(() => {
        resolve([]);
      });
    });
  }

  getMedicamentos() {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/medicamento');
      db.allDocs({
        include_docs: true,
      }).then((vista) => {
        const rows = vista.rows.filter((row: any) => {
          if (row.doc.id) {
            return row;
          }
        });
        console.log(rows);
        resolve(rows);
      }).catch(() => {
        resolve([]);
      });
    });
  }

  obtenerCitasPorDoctor(doctorId) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/citas');
    return new Promise((resolve) => {
      db.query('busquedas/porDoctor', {
        include_docs: true,
        key: doctorId
      }).then((vista) => {
        const docs = [];
        vista.rows.forEach(element => {
          docs.push(element.doc);
        });
        resolve(docs);
      });
    });
  }

  obtenerCitas(time) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/citas');
      const fecha = time.getFullYear() + (('0' + (time.getMonth() + 1)).slice(-2)) + (('0' + time.getDate()).slice(-2));
      db.allDocs({
        include_docs: true,
        attachments: false,
        startkey: fecha,
        endkey: fecha + '\ufff0'
      }).then((docs) => {
        const rows = docs.rows.filter((row: any) => {
          return row.doc.estado !== 'CANCELADA';
        });
        resolve(rows);
      }).catch((err) => {
        console.log('error al obtener las citas:', err);
        resolve([]);
      });
    });
  }

  getPaciente(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/pacientes');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('error al obtener el paciente:', err);
        resolve(null);
      });
    });
  }

  getMedicamento(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/medicamento');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('Error al obtener el medicamento:', err);
        resolve(null);
      });
    });
  }

  getCita(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/citas');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('error al obtener el paciente:', err);
        resolve(null);
      });
    });
  }

  // revisar guardarDocumento
  guardarDocumento(bd: any, data: any) {
    return new Promise((resolve, reject) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/');
      if (!navigator.onLine) {
        this.networkService.presentAlert();
        return reject(false);
      }
      db.put(bd + '/', data).then((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  guardarCita(data, callback) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/citas');
    db.get(data._id).then((doc) => {
      data._rev = doc._rev;
      db.put(data).then(() => {
        callback(true);
      }).catch((err) => {
        console.log(err);
        callback(false);
      });
    }).catch(() => {
      db.put(data).then(() => {
        callback(true);
      }).catch((err) => {
        console.log(err);
        callback(false);
      });
    });
  }

  guardarPreConsultas(data, callback) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/pre_consultas');
    db.get(data._id).then((doc) => {
      data._rev = doc._rev;
      db.put(data).then(() => {
        callback(true);
      }).catch((err) => {
        console.log(err);
        callback(false);
      });
    }).catch(() => {
      db.put(data).then(() => {
        callback(true);
      }).catch((err) => {
        console.log(err);
        callback(false);
      });
    });
  }

  quitarTildes(str) {
    while (str.indexOf('á') > -1) {
      str = str.replace('á', 'a');
    }
    while (str.indexOf('é') > -1) {
      str = str.replace('é', 'e');
    }
    while (str.indexOf('í') > -1) {
      str = str.replace('í', 'i');
    }
    while (str.indexOf('ó') > -1) {
      str = str.replace('ó', 'o');
    }
    while (str.indexOf('ú') > -1) {
      str = str.replace('ú', 'u');
    }
    return str;
  }

  buscarPacientePor(separado: any, viewName: string) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/pacientes');
      db.query('busquedas/' + viewName, {
        include_docs: true,
        keys: separado
      }).then((vista) => {
        resolve(vista.rows);
      }).catch(() => {
        resolve([]);
      });
    });
  }

  buscarPacienteNombre(term) {
    console.log('service de búsqueda');
    let resultados = [];
    return new Promise((resolve) => {
      term = this.quitarTildes(term.toLowerCase());
      const separado = term.split(' ');
      this.buscarPacientePor(separado, 'porPrimerNombre').then((res1) => {
        resultados = resultados.concat(res1);
        this.buscarPacientePor(separado, 'porSegundoNombre').then((res2) => {
          resultados = resultados.concat(res2);
          this.buscarPacientePor(separado, 'porPrimerApellido').then((res3) => {
            resultados = resultados.concat(res3);
            this.buscarPacientePor(separado, 'porSegundoApellido').then((res4) => {
              resultados = resultados.concat(res4);
              this.buscarPacientePor(separado, 'porTelefono').then((res5) => {
                resultados = resultados.concat(res5);
                console.log('resultados', resultados);
                const docs = [];
                resultados.forEach(element => {
                  const tempDoc = element.doc;
                  let nombreCompleto = tempDoc.primerNombre;
                  if (tempDoc.segundoNombre) {
                    nombreCompleto = nombreCompleto + ' ' + tempDoc.segundoNombre;
                  }
                  if (tempDoc.primerApellido) {
                    nombreCompleto = nombreCompleto + ' ' + tempDoc.primerApellido;
                  }
                  if (tempDoc.segundoApellido) {
                    nombreCompleto = nombreCompleto + ' ' + tempDoc.segundoApellido;
                  }
                  if (tempDoc.telefonoCelular) {
                    nombreCompleto = nombreCompleto + ' ' + tempDoc.telefonoCelular;
                  }
                  nombreCompleto = this.quitarTildes(nombreCompleto.toLowerCase());
                  let cumple = true;
                  separado.forEach((element2) => {
                    cumple = cumple && nombreCompleto.indexOf(element2) > -1;
                  });
                  if (cumple) {
                    const esta = docs.find((e) => {
                      return e.codigo === tempDoc.codigo;
                    });
                    if (esta === undefined) {
                      docs.push(tempDoc);
                    }
                  }
                });
                console.log('resultados filtrados', docs);
                resolve(docs);
              });
            });
          });
        });
      });
    });
  }

  guardarPaciente(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/pacientes');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  guardarPersonal(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  guardarSucursal(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  getDocDoctores(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('error al obtener el listado de doctores:', err);
        resolve(null);
      });
    });
  }

  eliminarPaciente(idDoc, resolve) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/pacientes');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  eliminarSucursal(idDoc, resolve){
    const db = new PouchDB('http://root:root@127.0.0.1:5984/agenda');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  eliminarMedicamento(idDoc, resolve) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/medicamento');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  eliminarCita(idDoc, resolve) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/citas');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  guardarMedicamento(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/medicamento');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }


  obtenerYAumentarCorrelativo(paramIdSucursal: number, paramTipo = 'COMPROBANTE') {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/correlativos');
    return new Promise((resolve) => {
      db.get('CORRELATIVOS').then((doc: any) => {
        const t = doc.list.find((el: any) => {
          return el.id === paramIdSucursal;
        });
        const sucursal = t.correlativos;
        let numero = 0;
        if (paramTipo === 'COMPROBANTE') {
          numero = sucursal.comprobante;
          numero++;
          sucursal.comprobante = numero;
        }
        db.put(doc).then(() => {
          const temp = ('00' + '1').slice(-2) + (('0000' + numero).slice(-5));
          const response: any = { codigo: sucursal.codigo, correlativo: temp, offline: true };
          resolve(response);
        }).catch(() => {
          const response: any = { codigo: 'OFF', correlativo: 1 };
          resolve(response);
        });
      }).catch(() => {
        const response: any = { codigo: 'OFF', correlativo: 1 };
        resolve(response);
      });
    });
  }

  citasPorPaciente(id: string) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/citas'); 
    return new Promise((resolve, reject) => {
      db.query('busquedas/porPaciente', {
        include_docs: false,
        key: id
      }).then((vista) => {
        const keysSelected = [];
        vista.rows.forEach(element => {
          keysSelected.push(element.id);
        });
        db.allDocs({
          include_docs: true,
          keys: keysSelected
        }).then((citas) => {
          const resultado = [];
          citas.rows.forEach(element => {
            console.log(element);
              resultado.push(element.doc);
          });
          resolve(resultado);
        }).catch(() => {
          resolve([]);
        });
      }).catch((err) => {
        console.log('errro', err);
        reject([]);
      });
    });
  }

  // viejos
  // authenticate(data) {
  //   return new Promise((resolve, reject) => {
  //     if (navigator.onLine) {
  //       this.httpClient.post(this.api + 'general/login', data).subscribe(
  //         res => {
  //           resolve(res);
  //           console.log('logging data', res);
  //         }, err => {
  //           console.error(err);
  //           reject(err);
  //         }
  //       );
  //     } else {
  //       const dataUser = JSON.parse(localStorage.getItem('logged'));
  //       if (dataUser != null) {
  //         resolve({ datos: { valid: true } });
  //       } else {
  //         resolve({ datos: { valid: false } });
  //       }
  //     }
  //   });
  // }

  async presentToast(msj: string, colorMsj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      color: colorMsj,
      position: 'top',
      cssClass: 'toaster'
    });
    toast.present();
  }

  authenticate(data) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/users');
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
        const dataUser = JSON.parse(localStorage.getItem('logged'));
        if (dataUser != null) {
          resolve({ datos: { valid: true } });
        } else {
          resolve({ datos: { valid: false } });
        }
      } else {
        this.httpClient.post(db + 'general/login', data).subscribe(
          res => {
            resolve(res);
            console.log('logging data', res);
          }, err => {
            console.error(err);
          }
        );
      }
    });
  }

  getUsuarios() {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/usuarios');
      db.allDocs({
        include_docs: true,
      }).then((vista) => {
        const rows = vista.rows.filter((row: any) => {
            return row;
        });
        console.log(rows);
        resolve(rows);
      }).catch(() => {
        resolve([]);
      });
    });
  }

  getUsuario(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/usuarios');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('error al obtener el paciente:', err);
        resolve(null);
      });
    });
  }

  guardarUsuario(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/usuarios');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }
  
  eliminarUsuario(idDoc, resolve) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/usuarios');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  getVenta(id) {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/ventas');
      db.get(id).then((doc) => {
        resolve(doc);
      }).catch((err) => {
        console.log('error al obtener la venta:', err);
        resolve(null);
      });
    });
  }

  guardarVentas(data) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/ventas');
    return new Promise((resolve) => {
      db.put(data).then((res) => {
        resolve(res);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  eliminarVenta(idDoc, resolve) {
    const db = new PouchDB('http://root:root@127.0.0.1:5984/ventas');
    const dataBase = db;
    db.get(idDoc).then(function (doc) {
      return dataBase.remove(doc);
    }).then(function (result) {
      resolve(true);
    }).catch(function (err) {
      console.log(err);
      resolve(false);
    });
  }

  getAllVentas() {
    return new Promise((resolve) => {
      const db = new PouchDB('http://root:root@127.0.0.1:5984/ventas');
      db.allDocs({
        include_docs: true,
      }).then((vista) => {
        const rows = vista.rows.filter((row: any) => {
            return row;
        });
        console.log(rows);
        resolve(rows);
      }).catch(() => {
        resolve([]);
      });
    });
  }

}
