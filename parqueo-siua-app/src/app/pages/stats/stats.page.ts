import {Component, OnInit} from '@angular/core';
import {StatsService} from '../../services/stats.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.page.html',
    styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

    timeFrames: string[] = [
        'Últimos 7 días',
        'Últimos 30 días',
        'Últimos 365 días'
    ];

    private forecastResult: number = 0;
    private forecastSelection: string;
    private forecastMinDate: string;
    private forecastMaxDate: string;

    constructor(private statsService: StatsService, private toastCtrl: ToastController) {
        this.forecastMinDate = this.addDaysToDate(0).toISOString();
        this.forecastMaxDate = this.addDaysToDate(6).toISOString();
    }

    ngOnInit() {
    }

    makePrediction() {
        if (this.forecastSelection) {
            const date: Date = new Date(this.forecastSelection);
            this.statsService.getForecast(date).subscribe(data => {
                const quantity = data.quantity;
                if (quantity >= 0) {
                    this.forecastResult = quantity;
                } else {
                    this.presentToast('No hay datos suficientes para realizar esta predicción');
                }
            });
        }
    }

    private addDaysToDate(days: number): Date {
        let date: Date = new Date(new Date().getTime());
        date = new Date(date.getTime() + (1000 * 60 * 60 * 24) * days);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        return date;
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }


}
