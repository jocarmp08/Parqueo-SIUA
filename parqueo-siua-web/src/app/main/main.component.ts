import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ContactComponent} from '../contact/contact.component';
import {EventsService} from '../events/rest/events.service';
import {Event} from '../events/rest/event.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [trigger('fade', [
    state('inactive', style({opacity: 0})),
    state('active', style({opacity: 1})),
    transition('* <=> *', [
      animate(5000)
    ])
  ])]
})
export class MainComponent implements OnInit {

  todayEvents: Array<Event>;
  animationState = 'active';
  currentEventId = 0;
  currentEvent: Event;
  timestamp: Date;

  constructor(private dialog: MatDialog, private eventsService: EventsService) {
  }

  ngOnInit() {
    this.loadTodayEvents();
    this.timestamp = new Date(new Date().getTime());
  }

  private loadTodayEvents() {
    const now = new Date(new Date().getTime());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);
    this.eventsService.getTodayEvents(today, tomorrow).subscribe(((data: Array<Event>) => {
      if (data.length > 0) {
        this.setTodayEvents(data);
        this.currentEvent = this.todayEvents[this.currentEventId];
      }
    }));
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
        if (this.currentEventId === this.todayEvents.length - 1) {
          this.currentEventId = 0;
        } else {
          this.currentEventId++;
        }
        this.currentEvent = this.todayEvents[this.currentEventId];
      }
      this.animationState = this.animationState === 'active' ? 'inactive' : 'active';
    }
  }

  setTodayEvents(value: Array<Event>) {
    this.todayEvents = value;
  }

}
