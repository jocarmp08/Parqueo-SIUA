import {TestBed} from '@angular/core/testing';

import {StatsService} from './stats.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

describe('Servicio de estadísticas: StatsService', () => {
    let service: StatsService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StatsService]
        });
        service = TestBed.get(StatsService);
        backend = TestBed.get(HttpTestingController);
    });

    it('Obtener predicción de entradas', () => {
        service.getForecast(new Date(new Date().getTime() + 1)).subscribe();
        const call: TestRequest = backend.expectOne((request) => {
            return request.url.includes('http://167.99.240.71:4097/forecast');
        });
        expect(call.request.method).toEqual('GET');
        backend.verify();
    });

    it('Obtener entradas desde fecha', () => {
        service.getEntriesFromDate(new Date(new Date().getTime() - 5)).subscribe();
        const call: TestRequest = backend.expectOne((request) => {
            return request.url.includes('http://167.99.240.71:3000/api/entrances');
        });
        expect(call.request.method).toEqual('GET');
        backend.verify();
    });
});
