import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ReportService} from './report.service';

@Injectable({
  providedIn: 'root'
})
export class ReportResolverService implements Resolve<any> {
  constructor(private eventsService: ReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const now = new Date(new Date().getTime());
    return this.eventsService.getReports();
  }
}
