import {TestBed} from '@angular/core/testing';

import {CountersService} from './counters.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

describe('Servicio de contadores: CountersService', () => {
    let service: CountersService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CountersService]
        });
        service = TestBed.get(CountersService);
        backend = TestBed.get(HttpTestingController);
    });

    it('Obtener contadores actuales', () => {
        service.getData().subscribe((response) => {
            expect(response).toEqual(jasmine.objectContaining({
                lastDataUpdateDate: '2019-01-12T17:31:08.522337-06:00',
                maxCommon: 40,
                maxHandicapped: 10,
                nowCommon: 35,
                nowHandicapped: 10,
                parkingEntrancesCounter: 62
            }));
        });

        const response = {
            'lastDataUpdateDate': '2019-01-12T17:31:08.522337-06:00',
            'maxCommon': 40,
            'maxHandicapped': 10,
            'nowCommon': 35,
            'nowHandicapped': 10,
            'parkingEntrancesCounter': 62
        };

        const call: TestRequest = backend.expectOne('http://167.99.240.71:4097/api');
        expect(call.request.method).toEqual('GET');
        call.flush(response);
        backend.verify();
    });
});
