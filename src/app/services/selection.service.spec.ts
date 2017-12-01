
import {} from 'jasmine';

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Headers, BaseRequestOptions, Response,
  HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { SelectionService } from './selection.service';

describe("Testing SelectionService", function() {

  let mockBackend: MockBackend;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ SelectionService ]
      });

      TestBed.compileComponents();
  }));

  it('get() should return defined', function() {
    let selectionService: SelectionService = getTestBed().get(SelectionService);
    console.log(selectionService);
  });
});
