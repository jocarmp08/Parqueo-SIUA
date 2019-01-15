import {TestBed} from '@angular/core/testing';

import {ContactService} from './contact.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

describe('Servicio de reportes: ContactService', () => {
    let service: ContactService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ContactService]
        });
        service = TestBed.get(ContactService);
        backend = TestBed.get(HttpTestingController);
    });

    it('Enviar reporte a BD', () => {
        const date = new Date(new Date().getTime());

        service.postReport({
            email: 'test@jasmine.com',
            type: 0,
            description: 'this is a e2e test',
            creationDate: date
        }).subscribe((response) => {
            expect(response).toEqual(jasmine.objectContaining({
                email: 'test@jasmine.com',
                type: 0,
                description: 'this is a e2e test',
                creationDate: date
            }));
        });

        const response = {
            'email': 'test@jasmine.com',
            'type': 0,
            'description': 'this is a e2e test',
            'creationDate': date
        };

        const call: TestRequest = backend.expectOne('http://167.99.240.71:3000/api/reports');
        expect(call.request.method).toEqual('POST');
        call.flush(response);
        backend.verify();
    });
});
