import {Component, OnInit} from '@angular/core';
import {EventModel} from '../../models/event.model';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  // Array of events
  eventsArray: Array<EventModel>;
  // Http error
  private httpError;

  constructor(private eventsService: EventsService) {
  }

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.httpError = null;
    this.eventsService.getEventsPublishedAndUnfinished().subscribe((data: Array<EventModel>) => {
      this.eventsArray = this.sortArrayByDateAsc(data);
    }, error => {
      this.httpError = error;
    });
  }

  private sortArrayByDateAsc(array: Array<EventModel>): Array<EventModel> {
    return array.sort((event1, event2) => {
      // Particularity of Typescript: operator + coerce to number
      return +new Date(event1.startDate) - +new Date(event2.startDate);
    });
  }

}
