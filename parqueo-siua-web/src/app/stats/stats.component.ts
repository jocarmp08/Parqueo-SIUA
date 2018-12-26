import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent, MatDialog, MatDialogConfig} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {StatsService} from './rest/stats.service';
import {Entrance} from './rest/entrance.model';
import {HistogramComponent} from '../histogram/histogram.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  // Deadlines
  yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
  tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

  // Histogram attributes
  timeFrames: string[] = [
    'Últimos 7 días',
    'Últimos 30 días',
    'Últimos 365 días',
    'Manual'];
  histogramForm = this.formBuilder.group({
    selectedTimeFrame: [null, Validators.required],
    fromDate: [null],
    toDate: [null],
  });

  constructor(private statsService: StatsService, private formBuilder: FormBuilder, private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  generateHistogram() {
    if (this.histogramForm.valid) {
      const values = Object.assign({}, this.histogramForm.value);
      if (values.selectedTimeFrame === 'Manual') {
        this.generateHistogramFromTo(values.fromDate, values.toDate);
      } else {
        // Time limits
        let fromDate: Date;
        switch (values.selectedTimeFrame) {
          case 'Últimos 7 días':
            console.log('Últimos 7 días');
            fromDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 8);
            break;
          case 'Últimos 30 días':
            console.log('Últimos 30 días');
            fromDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 31);
            break;
          case  'Últimos 365 días':
            console.log('Últimos 365 días');
            fromDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 366);
            break;
        }
        this.geneteHistogramFromDate(new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0));
      }
    }
  }

  private generateHistogramFromTo(from: Date, to: Date) {
    if (from && to) {
      if (from <= to) {
        this.statsService.getEntriesTimeFrame(from, to).subscribe((data: Array<Entrance>) => {
          if (data.length > 0) {
            this.openHistogramDialog(data);
          }
        }, (error) => {
          console.log(error);
        });
      } else {
        console.log('Escoja bien');
      }
    } else {
      console.log('Nop');
    }
  }

  private geneteHistogramFromDate(date: Date) {
    this.statsService.getEntriesFromDate(date).subscribe((data: Array<Entrance>) => {
      if (data.length > 0) {
        this.openHistogramDialog(data);
      }
    }, (error) => {
      console.log(error);
    });
  }

  private openHistogramDialog(data: Array<Entrance>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      values: data
    };
    this.dialog.open(HistogramComponent, dialogConfig);
  }

  makeForecast(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
  }

}
