import {Component, OnInit} from '@angular/core';
// import {Observable} from 'rxjs';
// import {MatDialog, MatDialogConfig} from '@angular/material';
import {SharedService} from '../../shared/shared.service';
import {CountersService} from '../../services/counters.service';
import {CounterModel} from '../../models/counter.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // Counters data
  private countersData: CounterModel;
  private countersStream;
  // Http errors
  private countersHttpError: boolean;

  public maxCommon: number = 89;
  public maxSpecial: number = 75;
  public commonCounter = this.maxCommon;
  public specialCounter = this.maxSpecial;
  private temp: number;

  constructor(private countersService: CountersService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.loadCounters();
  }

  private loadCounters() {
    // For UI issues
    this.countersHttpError = false;

    // Get current counters data
    this.countersService.getData().subscribe((data: CounterModel) => {
      this.countersData = data;
    }, error => {
      this.countersHttpError = true;
    });

    // Connect to stream for real-time updates
    // 1. Remove event listener in case of fail
    this.countersStream.removeEventListener('message', message => {
      this.countersData = JSON.parse(message['data']);
    });
    // 2. Add event listener
    this.countersStream.addEventListener('message', message => {
      this.countersData = JSON.parse(message['data']);
    });
  }

  showCounterDialog(type: string) {
    if (type === 'common') {
      this.sharedService.showCounterDialog(this.commonCounter, this.maxCommon).subscribe((data) => {
        if (data != null) {
          if (data >= 0 && data <= this.maxCommon) {
            this.commonCounter = data;
            console.log(data);
          }
        }
      });

    } else if (type === 'handicapped') {
      this.sharedService.showCounterDialog(this.specialCounter, this.maxSpecial).subscribe((data) => {
        if (data != null) {
          if (data >= 0 && data <= this.maxSpecial) {
            this.specialCounter = data;
            console.log(data);
          }
        }
      });
    }
  }

  changeMaxAvailable(type: string) {
    if (type == 'common') {
      this.temp = this.maxCommon;
      this.sharedService.changeMax(this.maxCommon).subscribe((data) => {
        if (data != null) {
          this.maxCommon = data;
          if (this.commonCounter - (this.temp - this.maxCommon) >= 0) {
            this.commonCounter -= this.temp - this.maxCommon;
          }
        }
        this.temp = 0;
      });

    }
    else {
      this.temp = this.maxSpecial;
      this.sharedService.changeMax(this.maxSpecial).subscribe((data) => {
        if (data != null) {
          this.maxSpecial = data;
          this.specialCounter -= this.temp - this.maxSpecial;
        }
        this.temp = 0;
      });
    }
  }

  incGC() {
    if (this.commonCounter < this.maxCommon) { //100 MAX
      this.commonCounter += 1;
    }
  }

  decGC() {
    if (this.commonCounter > 0) { //0 MIN
      this.commonCounter -= 1;
    }
  }

  incEC() {
    if (this.specialCounter < this.maxSpecial) { //100 MAX
      this.specialCounter += 1;
    }
  }

  decEC() {
    if (this.specialCounter > 0) { //0 MIN
      this.specialCounter -= 1;
    }
  }
}
