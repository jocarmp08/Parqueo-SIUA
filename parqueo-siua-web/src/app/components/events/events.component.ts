import {Component, OnInit} from '@angular/core';
import {EventModel} from '../../models/event.model';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  eventsArray: Array<EventModel>;

  constructor(private eventsService: EventsService) {
  }

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    /*
    // Events that end after the current date
    const now = new Date(new Date().getTime());
    this.eventsService.getEventNotEnded(now).subscribe(((data: Array<Event>) => {
      this.setEventsArray(data);
    }));
    */
  }

}
