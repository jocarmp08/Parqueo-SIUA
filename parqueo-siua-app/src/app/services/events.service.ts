import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    private endpoint: string = 'http://167.99.240.71:3000/api/';

    constructor(private httpClient: HttpClient) {
    }

    getEventsPublishedAndUnfinished(): Observable<any> {
        /*
        This method makes a request, to the database, of the events that have been published to date and have not yet ended
         */
        const now: Date = new Date(new Date().getTime());
        const publishedFilter: string = 'filter[where][publicationDate][lte]=' + now.toISOString();
        const unfinishedFilter: string = 'filter[where][endDate][gt]=' + now.toISOString();
        const url: string = this.endpoint + 'events?' + publishedFilter + '&' + unfinishedFilter;
        return this.httpClient.get(url).pipe(map(this.extractData));

    }

    getEventsPublishedAndEndingJustToday() {
        const now: Date = new Date(new Date().getTime());
        // const today: Date = this.todaysDate();
        const tomorrow: Date = this.tomorrowsDate();
        const publishedFilter: string = 'filter[where][publicationDate][lte]=' + now.toISOString();
        const finishedTodayFilter: string = 'filter[where][endDate][between][0]=' + now.toISOString() + '&filter[where][endDate][between][1]=' + tomorrow.toISOString();
        const url: string = this.endpoint + 'events?' + publishedFilter + '&' + finishedTodayFilter;
        return this.httpClient.get(url).pipe(map(this.extractData));
    }

    private todaysDate(): Date {
        let date: Date = new Date(new Date().getTime());
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        return date;
    }

    private tomorrowsDate(): Date {
        let date: Date = new Date(new Date().getTime());
        date = new Date(date.getTime() + 1000 * 60 * 60 * 24);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        return date;
    }

    private extractData(res: Response) {
        return res || {};
    }
}
