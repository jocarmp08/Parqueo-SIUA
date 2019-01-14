import {Component, OnInit} from '@angular/core';
import {StatsService} from '../../services/stats.service';
import {NavController, ToastController} from '@ionic/angular';
import {EntranceModel} from '../../models/entrance.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.page.html',
    styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

    histogramTimeFrames: string[] = [
        'Últimos 7 días',
        'Últimos 30 días',
        'Últimos 365 días'
    ];
    private histogramSelectedTF: string;

    private forecastResult: number = 0;
    private forecastSelection: string;
    private forecastMinDate: string;
    private forecastMaxDate: string;

    constructor(private statsService: StatsService, private toastCtrl: ToastController, private navController: NavController) {
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
                    this.presentToast('No hay suficientes datos para realizar esta predicción');
                }
            });
        } else {
            this.presentToast('Debe seleccionar una fecha');
        }
    }

    generateHistogram() {
        if (this.histogramSelectedTF) {
            // Time limits
            let fromDate: Date;

            // String comparison workaround - Typescript is weird
            if (this.histogramSelectedTF.match(this.histogramTimeFrames[0])) {
                fromDate = this.substractDaysToDate(7);
            } else if (this.histogramSelectedTF.match(this.histogramTimeFrames[1])) {
                fromDate = this.substractDaysToDate(30);
            } else {
                fromDate = this.substractDaysToDate(365);
            }

            if (fromDate) {
                this.statsService.getEntriesFromDate(fromDate).subscribe((data: Array<EntranceModel>) => {
                    if (data.length > 0) {
                        this.navController.navigateForward(['chart', JSON.stringify(data)]);
                    } else {
                        this.presentToast('No hay suficientes datos para generar el histograma');
                    }
                }, (error) => {
                    console.log('Error' + error);
                });
            }
            this.histogramSelectedTF = null;
        } else {
            this.presentToast('Debe seleccionar un período de tiempo');
        }
    }

    private addDaysToDate(days: number): Date {
        let date: Date = new Date(new Date().getTime());
        date = new Date(date.getTime() + (1000 * 60 * 60 * 24) * days);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        return date;
    }

    private substractDaysToDate(days: number): Date {
        let date: Date = new Date(new Date().getTime());
        date = new Date(date.getTime() - (1000 * 60 * 60 * 24) * days);
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
