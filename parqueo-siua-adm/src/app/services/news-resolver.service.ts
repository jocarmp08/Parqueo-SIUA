import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {NewsService} from './news.service';

@Injectable({
  providedIn: 'root'
})
export class NewsResolverService implements Resolve<any> {
  constructor(private newsService: NewsService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const lastWeek = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 8);
    return this.newsService.getNewsPublishedAfter(lastWeek);
  }
}
