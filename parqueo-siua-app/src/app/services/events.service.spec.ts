import {TestBed} from '@angular/core/testing';

import {EventsService} from './events.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

describe('Servicio de eventos: EventsService', () => {
    let service: EventsService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EventsService]
        });
        service = TestBed.get(EventsService);
        backend = TestBed.get(HttpTestingController);
    });

    it('Obtener eventos publicados y no finalizados', () => {
        service.getEventsPublishedAndUnfinished().subscribe();
        const call: TestRequest = backend.expectOne((request) => {
            return request.url.includes('http://167.99.240.71:3000/api/events');
        });
        expect(call.request.method).toEqual('GET');
        backend.verify();
    });

    it('Obtener eventos publicados y que finalizan hoy', () => {
        service.getEventsPublishedAndEndingJustToday().subscribe();
        const call: TestRequest = backend.expectOne((request) => {
            return request.url.includes('http://167.99.240.71:3000/api/events');
        });
        expect(call.request.method).toEqual('GET');
        backend.verify();
    });
});
