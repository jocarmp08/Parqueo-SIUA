import {TestBed} from '@angular/core/testing';

import {NewsService} from './news.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

describe('Servicio de noticias: NewsService', () => {
    let service: NewsService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [NewsService]
        });
        service = TestBed.get(NewsService);
        backend = TestBed.get(HttpTestingController);
    });

    it('Obtener noticias publicadas desde fecha y hasta fecha', () => {
        service.getNewsPublishedFromAndTo(new Date(new Date().getTime()), new Date(new Date().getTime() + 1)).subscribe();
        const call: TestRequest = backend.expectOne((request) => {
            return request.url.includes('http://167.99.240.71:3000/api/news');
        });
        expect(call.request.method).toEqual('GET');
        backend.verify();
    });
});
