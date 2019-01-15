import {Component, OnInit} from '@angular/core';
import {Event} from './rest/event.model';
import {EventsService} from './rest/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  eventsArray: Array<Event>;

  constructor(private eventsService: EventsService) {
  }

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    // Events that end after the current date
    const now = new Date(new Date().getTime());
    this.eventsService.getEventNotEnded(now).subscribe(((data: Array<Event>) => {
      this.setEventsArray(data);
    }));
  }

  setEventsArray(value: Array<Event>) {
    this.eventsArray = value;

  }

}
