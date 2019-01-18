import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {PopoverMenuComponent} from './components/popover-menu/popover-menu.component';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {Firebase} from '@ionic-native/firebase/ngx';
import {FcmService} from './services/fcm.service';

const config = {
    apiKey: 'AIzaSyCPw4vXNJj64Df3M66h8SoSY4UGKv466nA',
    authDomain: 'parqueo-siua.firebaseapp.com',
    databaseURL: 'https://parqueo-siua.firebaseio.com',
    projectId: 'parqueo-siua',
    storageBucket: 'parqueo-siua.appspot.com',
    messagingSenderId: '412317655761'
};

@NgModule({
    declarations: [AppComponent, PopoverMenuComponent],
    entryComponents: [PopoverMenuComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(config),
        AngularFirestoreModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Firebase,
        FcmService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
