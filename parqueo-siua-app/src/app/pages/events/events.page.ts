import {Component, OnInit} from '@angular/core';
import {EventModel} from '../../models/event.model';
import {EventsService} from '../../services/events.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    private httpError;
    private eventsArray: Array<EventModel>;

    constructor(private eventsService: EventsService) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadEvents(null);
    }

    loadEvents(refresher) {
        this.httpError = null;
        this.eventsService.getEventsPublishedAndUnfinished().subscribe((data: Array<EventModel>) => {
            this.eventsArray = this.sortArrayByDateAsc(data);
            if (refresher != null) {
                refresher.target.complete();
            }
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
