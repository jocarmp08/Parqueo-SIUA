import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CountersService {

    private endpoint: string = 'http://167.99.240.71:4097/';

    constructor(private httpClient: HttpClient) {
    }

    getData(): Observable<any> {
        const url = this.endpoint + 'api';
        return this.httpClient.get(url).pipe(map(this.extractData));
    }

    connect() {
        const url = this.endpoint + 'stream';
        return new EventSource(url);
    }

    private extractData(res: Response) {
        return res || {};
    }
}
