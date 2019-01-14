import {Component, OnInit} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {CounterModel} from '../../models/counter.model';
import {CountersService} from '../../services/counters.service';
import {EventModel} from '../../models/event.model';
import {PopoverMenuComponent} from '../../components/popover-menu/popover-menu.component';
import {Platform, PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    private countersHttpError: boolean;
    private todayHttpError: boolean;
    private todayEvents: Array<EventModel>;
    private countersData: CounterModel;
    private countersStream;
    private backButton;

    constructor(private countersService: CountersService, private eventsService: EventsService,
                private popoverController: PopoverController, private platform: Platform) {
        this.countersData = new CounterModel();
        this.countersData.nowCommon = 0;
        this.countersData.nowHandicapped = 0;
        this.countersStream = this.countersService.getEventTarget();
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadData();
    }

    ionViewDidEnter() {
        this.backButton = this.platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave() {
        this.disconnectCountersStream();
        this.backButton.unsubscribe();
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

    private disconnectCountersStream() {
        this.countersStream.removeEventListener('message', message => {
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

    private async openPopoverMenu(event: Event) {
        const popover = await this.popoverController.create({
            component: PopoverMenuComponent,
            event: event,
            showBackdrop: false
        });
        popover.present();
    }
}