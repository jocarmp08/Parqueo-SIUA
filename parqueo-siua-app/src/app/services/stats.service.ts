import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StatsService {

    constructor(private httpClient: HttpClient) {
    }

    getForecast(date: Date): Observable<any> {
        const url = 'http://167.99.240.71:4097/forecast';
        let params = new HttpParams().set('date', date.toISOString());
        return this.httpClient.get(url, {params: params}).pipe(map(this.extractData));
    }

    getEntriesFromDate(date: Date): Observable<any> {
        const endpoint = 'http://167.99.240.71:3000/api/';
        const url = endpoint + 'entrances?filter[order]=date&filter[where][date][gte]=' + date.toISOString();
        return this.httpClient.get(url).pipe(map(this.extractData));
    }

    private extractData(res: Response) {
        return res || {};
    }

}
