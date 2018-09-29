
import {} from 'jasmine';

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { ConflictsService } from './conflicts.service';
import { SelectionService } from './selection.service';

describe("Testing ConflictsService", function() {

  let conflictsService: ConflictsService;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ ConflictsService, SelectionService ]
      });

      TestBed.compileComponents();

      conflictsService = getTestBed().get(ConflictsService);
  }));

  it('conflictsService should be defined', function() {
    expect(conflictsService).toBeDefined();
  });
});
