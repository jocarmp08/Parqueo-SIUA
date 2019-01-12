import {Component, OnInit} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {CounterModel} from '../../models/counter.model';
import {CountersService} from '../../services/counters.service';
import {EventModel} from '../../models/event.model';
import {PopoverController} from '@ionic/angular';
import {PopoverMenuComponent} from '../../components/popover-menu/popover-menu.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    private httpError;
    private todayEvents: Array<EventModel>;
    private countersData: CounterModel;
    private countersListener;

    constructor(private countersService: CountersService, private eventsService: EventsService, private popoverController: PopoverController) {
        this.countersData = new CounterModel();
        this.countersData.nowCommon = 0;
        this.countersData.nowHandicapped = 0;
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.loadData();
    }

    ionViewWillLeave() {
        this.disconnectCountersListener();
    }

    private loadData() {
        this.httpError = null;
        this.loadCounters();
        this.connectCountersListener();
        this.loadTodayEvents();
    }

    private loadCounters() {
        this.countersService.getData().subscribe((data: CounterModel) => {
            this.countersData = data;
        }, error => {
            this.httpError = error;
        });
    }

    private connectCountersListener() {
        this.countersListener = this.countersService.connect();
        this.countersListener.addEventListener('message', message => {
            this.countersData = JSON.parse(message['data']);
        });
    }

    private disconnectCountersListener() {
        this.countersListener.close();
    }

    private loadTodayEvents() {
        this.eventsService.getEventsPublishedAndEndingJustToday().subscribe((data: Array<EventModel>) => {
            if (data.length > 0) {
                this.todayEvents = this.sortEventsByStartDateAsc(data);
            }
        }, error => {
            this.httpError = error;
        });
    }

    private sortEventsByStartDateAsc(array: Array<EventModel>): Array<EventModel> {
        return array.sort((event1, event2) => {
            // Particularity of Typescript: operator + coerce to number
            return +new Date(event1.startDate) - +new Date(event2.startDate);
        });
    }

    private async openPopoverMenu(event: Event) {
        const popover = await this.popoverController.create({
            component: PopoverMenuComponent,
            event: event,
            showBackdrop: false
        });
        popover.present();
    }
}