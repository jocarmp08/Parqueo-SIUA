import {Component} from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FcmService} from './services/fcm.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private fcm: FcmService,
        public toastController: ToastController
    ) {
        this.initializeApp();
    }

    private async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 3000
        });
        toast.present();
    }

    private notificationSetup() {
        this.fcm.getToken();
        this.fcm.listenToNotifications().subscribe(
            (msg) => {
                if (this.platform.is('ios')) {
                    this.presentToast(msg.aps.alert);
                } else {
                    this.presentToast(msg.body);
                }
            });
    }


    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.backgroundColorByHexString('#bc093b');
            this.splashScreen.hide();
            this.notificationSetup();
        });
    }
}
