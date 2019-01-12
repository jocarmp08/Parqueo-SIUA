import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private endpoint: string = 'http://167.99.240.71:3000/api/';

    constructor(private httpClient: HttpClient) {
    }

    getNewsPublishedFromAndTo(from: Date, to: Date): Observable<any> {
        /*
       This method makes a request, to the database, of the news that have been published since <from> until <to>.
        */
        const fromFilter: string = 'filter[where][publicationDate][gte]=' + from.toISOString();
        const toFilter: string = 'filter[where][publicationDate][lte]=' + to.toISOString();
        const url: string = this.endpoint + 'news?' + fromFilter + '&' + toFilter;
        return this.httpClient.get(url).pipe(map(this.extractData));
    }

    private extractData(res: Response) {
        return res || {};
    }
}
