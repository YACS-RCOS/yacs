
import {} from 'jasmine';

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { SelectionService } from './selection.service';

describe("Testing SelectionService", function() {

  let selectionService: SelectionService;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ SelectionService ]
      });

      TestBed.compileComponents();

      selectionService = getTestBed().get(SelectionService);
  }));

  it('selectionService should be defined', function() {
    expect(selectionService).toBeDefined();
  });
});
