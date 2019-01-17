import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root'
})
export class EventsResolverService implements Resolve<any> {
  constructor(private eventsService: EventsService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const now = new Date(new Date().getTime());
    return this.eventsService.getEventNotEnded(now);
  }
}
