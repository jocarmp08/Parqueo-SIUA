import {Injectable} from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {Platform, ToastController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    constructor(private firebaseNative: Firebase, private afs: AngularFirestore, private platform: Platform, private toast: ToastController) {
    }

    async getToken() {
        let token;

        if (this.platform.is('android')) {
            token = await this.firebaseNative.getToken();
        } else if (this.platform.is('ios')) {
            token = await this.firebaseNative.getToken();
            await this.firebaseNative.grantPermission();
        }

        this.saveTokenToFirestore(token);
        this.subscribeToTopic();
    }

    private saveTokenToFirestore(token) {
        if (!token) return;
        const devicesRef = this.afs.collection('devices');

        const data = {
            token,
            userId: 'testUserId'
        };

        return devicesRef.doc(token).set(data);
    }

    private subscribeToTopic() {
        this.firebaseNative.subscribe('news');
        this.firebaseNative.subscribe('events');
    }

    private async presentToast(message) {
        const toaste = await this.toast.create({
            message,
            duration: 3000
        });
        toaste.present();
    }

    listenToNotifications() {
        return this.firebaseNative.onNotificationOpen();
    }
}
