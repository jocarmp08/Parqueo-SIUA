import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../shared/shared.service';
import {CountersService} from '../../services/counters.service';
import {CounterModel} from '../../models/counter.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // Username
  private username: string;
  // Counters data
  private countersData: CounterModel;
  private countersStream;
  // Http errors
  private countersHttpError: boolean;

  constructor(private countersService: CountersService, private sharedService: SharedService) {
    this.countersData = {
      nowCommon: 0,
      nowHandicapped: 0,
      maxCommon: 0,
      maxHandicapped: 0,
      lastDataUpdateDate: null
    };
    this.countersStream = this.countersService.getEventTarget();
    this.username = localStorage.getItem('username');
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

  private modifyNowCounters(type: string) {
    if (type === 'common') {
      this.sharedService.showModifyNowCounterDialog(this.countersData.nowCommon, this.countersData.maxCommon).subscribe((data) => {
        if (data != null) {
          if (data >= 0 && data <= this.countersData.maxCommon) {
            this.updateNowCounters('common', data);
          }
        }
      });
    } else if (type === 'handicapped') {
      this.sharedService.showModifyNowCounterDialog(this.countersData.nowHandicapped, this.countersData.maxHandicapped).subscribe((data) => {
        if (data != null) {
          if (data >= 0 && data <= this.countersData.maxHandicapped) {
            this.updateNowCounters('handicapped', data);
          }
        }
      });
    }
  }

  private updateNowCounters(type: string, value: number) {
    if (type === 'common') {
      this.countersService.putNowCounters(value, this.countersData.nowHandicapped).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    } else if (type === 'handicapped') {
      this.countersService.putNowCounters(this.countersData.nowCommon, value).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  private modifyMaxCounters(type: string) {
    if (type === 'common') {
      this.sharedService.showModifyMaxCounterDialog(this.countersData.maxCommon).subscribe((data) => {
        if (data != null) {
          this.updateMaxCounters('common', data);
        }
      });

    } else if (type === 'handicapped') {
      this.temp = this.maxSpecial;
      this.sharedService.showModifyMaxCounterDialog(this.countersData.maxHandicapped).subscribe((data) => {
        if (data != null) {
          this.updateMaxCounters('handicapped', data);
        }
      });
    }
  }

  private updateMaxCounters(type: string, value: number) {
    if (type === 'common') {
      const nowCommonDiff = this.countersData.nowCommon - (this.countersData.maxCommon - value);
      this.countersService.putMaxCounters(value, this.countersData.maxHandicapped, nowCommonDiff, this.countersData.nowHandicapped).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    } else if (type === 'handicapped') {
      const nowHandicappedDiff = this.countersData.nowHandicapped - (this.countersData.maxHandicapped - value);
      this.countersService.putMaxCounters(this.countersData.maxCommon, value, this.countersData.nowCommon, nowHandicappedDiff).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  inCommonCounter() {
    if (this.countersData.nowCommon > 0) {
      this.countersService.putNowCommonCounterByOne('in').subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  outCommonCounter() {
    if (this.countersData.nowCommon !== this.countersData.maxCommon) {
      this.countersService.putNowCommonCounterByOne('out').subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  inHandicappedCounter() {
    if (this.countersData.nowHandicapped > 0) {
      this.countersService.putNowHandicappedCounterByOne('in').subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  outHandicappedCounter() {
    if (this.countersData.nowHandicapped !== this.countersData.maxHandicapped) {
      this.countersService.putNowHandicappedCounterByOne('out').subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
  }

  private logout() {
    this.sharedService.logout();
  }

  private changePassword() {
    this.sharedService.changePassword();
  }

}
