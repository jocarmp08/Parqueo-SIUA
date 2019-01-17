import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent, MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {StatsService} from '../../services/stats.service';
import {EntranceModel} from '../../models/entrance.model';
import {HistogramComponent} from '../histogram/histogram.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  // Histogram attributes
  private histogramMinDate: Date;
  private histogramMaxDate: Date;
  private histogramTimeFrames: string[] = [
    'Últimos 7 días',
    'Últimos 30 días',
    'Últimos 365 días',
    'Manual'];
  private histogramForm;

  private forecastResult = 0;
  private forecastMinDate: Date;
  private forecastMaxDate: Date;

  constructor(private statsService: StatsService, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.forecastMinDate = this.addDaysToDate(0);
    this.forecastMaxDate = this.addDaysToDate(6);
    this.histogramMinDate = this.substractDaysToDate(365);
    this.histogramMaxDate = this.substractDaysToDate(1);
    this.buildHistogramForm();
  }

  ngOnInit() {
  }

  // FORECAST METHODS /////
  makeForecast(event: MatDatepickerInputEvent<Date>) {
    const date: Date = event.value;
    if (date) {
      this.statsService.getForecast(date).subscribe(data => {
        const quantity = data.quantity;
        if (quantity >= 0) {
          this.forecastResult = quantity;
        } else {
          this.showSnackBarMessage('No hay suficientes datos para realizar esta predicción', 'Aceptar');
        }
      }, error => {
        this.showSnackBarError();
      });
    }
  }

  // HISTOGRAM METHODS /////
  generateHistogram() {
    if (this.histogramForm.get('selectedTimeFrame').value === 'Manual') {
      const fromDate = this.histogramForm.get('fromDate').value;
      const toDate = this.histogramForm.get('toDate').value;
      this.generateHistogramCustomTimeFrame(fromDate, toDate);
    } else {
      const selectedTimeFrame = this.histogramForm.get('selectedTimeFrame').value;
      this.generateHistogramDefaultTimeFrame(selectedTimeFrame);
    }
  }

  private generateHistogramDefaultTimeFrame(selectedTimeFrame: string) {
    let date: Date;
    switch (selectedTimeFrame) {
      case 'Últimos 7 días':
        date = this.substractDaysToDate(7);
        break;
      case 'Últimos 30 días':
        date = this.substractDaysToDate(30);
        break;
      case  'Últimos 365 días':
        date = this.substractDaysToDate(365);
        break;
    }

    this.statsService.getEntriesFromDate(date).subscribe((data: Array<EntranceModel>) => {
      if (data.length > 0) {
        this.openHistogramDialog(data);
      } else {
        this.showSnackBarMessage('No hay datos para construir el histograma', 'Aceptar');
      }
    }, error => {
      this.showSnackBarError();
    });
  }

  private generateHistogramCustomTimeFrame(from: Date, to: Date) {
    if (from >= to) {
      this.showSnackBarMessage('La fecha inicial debe ser menor a la fecha final', 'Aceptar');
    } else {
      this.statsService.getEntriesFromTo(from, to).subscribe((data: Array<EntranceModel>) => {
        if (data.length > 0) {
          this.openHistogramDialog(data);
        } else {
          this.showSnackBarMessage('No hay datos para construir el histograma', 'Aceptar');
        }
      }, error => {
        this.showSnackBarError();
      });
    }
  }

  // AUX METHODS /////
  private showSnackBarError() {
    this.showSnackBarMessage(' Error estableciendo conexión con la base de datos', 'Aceptar');
  }

  private showSnackBarMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  private openHistogramDialog(data: Array<EntranceModel>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      values: data
    };
    this.dialog.open(HistogramComponent, dialogConfig);
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

  private buildHistogramForm() {
    this.histogramForm = this.formBuilder.group({
      selectedTimeFrame: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });

    this.histogramForm.get('fromDate').disable();
    this.histogramForm.get('toDate').disable();

    this.histogramForm.get('selectedTimeFrame').valueChanges
      .subscribe(selectedTimeFrame => {
        if (selectedTimeFrame !== 'Manual') {
          this.histogramForm.get('fromDate').reset();
          this.histogramForm.get('fromDate').disable();
          this.histogramForm.get('toDate').reset();
          this.histogramForm.get('toDate').disable();
        } else {
          this.histogramForm.get('fromDate').enable();
          this.histogramForm.get('toDate').enable();
        }
      });
  }

}
