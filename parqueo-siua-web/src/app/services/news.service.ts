import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

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
    let params = new HttpParams();
    // From filter
    params = params.set('filter[where][publicationDate][gte]', from.toISOString());
    // To filter
    params = params.set('filter[where][publicationDate][lte]', to.toISOString());
    const url: string = this.endpoint + 'news';
    return this.httpClient.get(url, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  private extractData(res: Response) {
    return res || {};
  }
}
