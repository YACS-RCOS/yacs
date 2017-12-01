
import {} from 'jasmine';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Injectable} from '@angular/core';

import { YacsService } from './yacs.service';

describe("Testing YacsService", function() {
  beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          YacsService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory:
              (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                  return new Http(backend, defaultOptions);
              }
           }
        ],
        imports: [
          FormsModule,
          HttpModule
        ]
      });

      TestBed.compileComponents();
  }));

  it('get() should return defined', function() {
    let yacsService: YacsService = getTestBed().get(YacsService);
    console.log(yacsService.baseUrl);
  });
});
