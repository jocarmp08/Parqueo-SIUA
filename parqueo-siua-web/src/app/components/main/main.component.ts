import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ContactComponent} from '../contact/contact.component';
import {EventsService} from '../../services/events.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CounterModel} from '../../models/counter.model';
import {CountersService} from '../../services/counters.service';
import {EventModel} from '../../models/event.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [trigger('fade', [
    state('inactive', style({opacity: 0})),
    state('active', style({opacity: 1})),
    transition('* <=> *', [
      animate(5000)
    ])
  ])]
})
export class MainComponent implements OnInit {

  // Counters data
  private countersData: CounterModel;
  private countersStream;
  // Array of events for today
  private todayEvents: Array<EventModel>;
  // Animation flags
  animationState = 'active';
  currentEventIdAnimation = 0;
  currentEventAnimation: EventModel;
  // Http errors
  private countersHttpError: boolean;
  private todayHttpError: boolean;

  constructor(private countersService: CountersService, private eventsService: EventsService, private dialog: MatDialog) {
    this.countersData = new CounterModel();
    this.countersData.nowCommon = 0;
    this.countersData.nowHandicapped = 0;
    this.countersStream = this.countersService.getEventTarget();
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadCounters();
    this.loadTodayEvents();
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

  private loadTodayEvents() {
    // For UI issues
    this.todayHttpError = false;

    this.eventsService.getEventsPublishedAndEndingJustToday().subscribe((data: Array<EventModel>) => {
      if (data.length > 0) {
        this.todayEvents = this.sortEventsByStartDateAsc(data);
      } else {
        this.todayEvents = null;
      }
    }, error => {
      this.todayHttpError = true;
    });
  }

  private sortEventsByStartDateAsc(array: Array<EventModel>): Array<EventModel> {
    return array.sort((event1, event2) => {
      // Particularity of Typescript: operator + coerce to number
      return +new Date(event1.startDate) - +new Date(event2.startDate);
    });
  }

  openContactDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ContactComponent, dialogConfig);
  }

  onDone() {
    if (this.todayEvents.length > 0) {
      if (this.animationState === 'inactive') {
        if (this.currentEventIdAnimation === this.todayEvents.length - 1) {
          this.currentEventIdAnimation = 0;
        } else {
          this.currentEventIdAnimation++;
        }
        this.currentEventAnimation = this.todayEvents[this.currentEventIdAnimation];
      }
      this.animationState = this.animationState === 'active' ? 'inactive' : 'active';
    }
  }
}
