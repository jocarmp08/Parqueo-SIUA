import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {EntranceModel} from '../../models/entrance.model';
import {ActivatedRoute} from '@angular/router';
import {Chart} from 'chart.js/dist/Chart.bundle.js';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.page.html',
    styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {

    rawData: Array<EntranceModel>;
    backgroundColor = 'rgba(255, 99, 132, 0.2)';
    borderColor = 'rgba(255,99,132,1)';

    @ViewChild('barCanvas') barCanvas;
    barChart: any;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.rawData = JSON.parse(this.route.snapshot.paramMap.get('data'));
        this.prepare();
    }

    prepare() {
        const dateFormatter = new DatePipe('en-GB');
        const values: Array<number> = [];
        const labels: Array<string> = [];
        const backgrounds: Array<string> = [];
        const borders: Array<string> = [];
        for (let i = 0; i < this.rawData.length; i++) {
            values.push(this.rawData[i].quantity);
            labels.push(dateFormatter.transform(this.rawData[i].date, 'dd/MM/yyyy'));
            backgrounds.push(this.backgroundColor);
            borders.push(this.borderColor);
        }

        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{data: values, label: 'Entradas al parqueo'}]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });
    }

}
