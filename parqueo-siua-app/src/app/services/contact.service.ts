import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    endpoint = 'http://167.99.240.71:3000/api/';

    constructor(private httpClient: HttpClient) {
    }

    postReport(report): Observable<any> {
        const url = this.endpoint + 'reports';
        return this.httpClient.post(url, report).pipe(
            catchError(this.handleError),
            map(this.extractData)
        );
    }

    private handleError(error: HttpErrorResponse) {
        return Observable.throw(error);
    }

    private extractData(res: Response) {
        return res || {};
    }
}
