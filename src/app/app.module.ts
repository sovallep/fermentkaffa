import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NetworkService } from './services/network.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx/';
import { AnioMesModalPageModule } from './anio-mes-modal/anio-mes-modal.module';
import { CitaDisponiblePageModule } from './cita-disponible/cita-disponible.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    AnioMesModalPageModule,
    CitaDisponiblePageModule,
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    })],
  providers: [NetworkService, HttpClient, TranslateService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SplashScreen, StatusBar, Network, Camera, File, FilePath, WebView, FileTransfer, FileOpener
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
