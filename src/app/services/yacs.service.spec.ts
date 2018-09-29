
import {} from 'jasmine';

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Headers, BaseRequestOptions, Response,
  HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { YacsService } from './yacs.service';

describe("Testing YacsService", function() {

  let mockBackend: MockBackend;

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
          HttpModule
        ]
      });

      TestBed.compileComponents();
  }));

  it('get() should return defined', function() {
    let yacsService: YacsService = getTestBed().get(YacsService);

    // Testing that yacsService is defined
    expect(yacsService).toBeDefined();

    // Example from SchoolListComponent - makes sure that something is returned (specifically a promise)
    expect(yacsService.get('schools', { show_departments: true })).toBeDefined();
  });
});
