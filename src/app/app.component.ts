import { NetworkService } from './services/network.service';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NavController, Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Agenda',
      url: '/agenda',
      icon: 'calendar'
    },
    {
      title: 'Regiones',
      url: '/regiones',
      icon: 'location-outline'
    }
   ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private navController: NavController,
    private networkService: NetworkService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', (event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('Se presiono back');
        }, false);
      });
      setTimeout(() => {
        this.networkService.checkConnectionBehaviour();
      }, 2000);
      this.splashScreen.hide();
    });
  }
  salir() {
    localStorage.removeItem('logged');
    this.navController.navigateRoot(['/login']);
  }

}
