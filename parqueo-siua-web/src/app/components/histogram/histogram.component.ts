import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntranceModel} from '../../models/entrance.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit {

  rawData: Array<EntranceModel>;
  chartType: string = 'bar';
  chartDatasets: Array<any>;
  chartLabels: Array<any>;
  chartColors: Array<any>;
  chartOptions: any = {
    responsive: true
  };
  backgroundColor = 'rgba(255, 99, 132, 0.2)';
  borderColor = 'rgba(255,99,132,1)';

  constructor(private dialogRef: MatDialogRef<HistogramComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.rawData = data.values;
  }

  ngOnInit() {
    this.prepareData();
  }

  prepareData() {
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
      console.log(i);
    }

    this.chartDatasets = [
      {data: values, label: 'Histograma de uso'}
    ];

    this.chartLabels = labels;

    this.chartColors = [
      {backgroundColor: backgrounds, borderColor: borders, borderWidth: 2}
    ];
  }

  closeDialog() {
    this.dialogRef.close();
  }

  chartClicked(e: any): void {
  }

  chartHovered(e: any): void {
  }
}
