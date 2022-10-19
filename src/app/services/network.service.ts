import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform, AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';



export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  alert;
  toast;

  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private network: Network,
    private alertController: AlertController,
  ) {
    this.inicializar();
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
  }

  getCurrentNetworkStatus() {
    return this.status.getValue();
  }

  checkConnectionBehaviour() {
    this.platform.ready().then(() => {
      this.network.onConnect().subscribe(() => {
        this.toast.dismiss();
      });
      this.network.onDisconnect().subscribe(() => {
        this.presentToast();
      });
    });
  }

  inicializar() {

  }
  async presentAlert() {
    this.alert = await this.alertController.create({
      header: 'fermentkaffa',
      subHeader: 'Atención',
      message: 'Necesita una conexión a internet para continuar',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Entendido',
          handler: () => {}
        }
      ]
    });

    this.alert.present();
  }

  async presentToast() {
    this.toast = await this.toastController.create({
      message: 'No cuenta con conexión a Internet',
      position: 'bottom',
      color: 'danger',
      buttons : [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
          console.log('Cierre toast de conexion');
          }
        }
      ]
    });
    this.toast.present();
  }

}
