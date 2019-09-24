
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import * as Stubs from '../../lib/router-stubs';

import { Term, Course, Listing } from 'yacs-api-client';
import { ListingDetailModule } from './module';
import { ListingDetailComponent } from './component';
import { ConflictsService } from '../services/conflicts.service';
import { YacsService } from '../services/yacs.service';

class YacsServiceMock {
  get(path:string, params:Object = {}) : Promise<Object> {
    var json_data:Object =
    {"courses":[
      {"id":1,"name":"Mock Course","number":1,"min_credits":4,"max_credits":4,"description":"test","department_id":1}
    ]};
    return Promise.resolve(json_data);
  }
}

var mockActivatedRoute:any;
  class MockActivatedRoute {
      subscribe = jasmine.createSpy('subscribe');
  }

class MockConflictsService {
    populateConflictsCache(data) {
    }
}

describe("Testing listing-detail component", function() {
  let component: ListingDetailComponent;
  let fixture: ComponentFixture<ListingDetailComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       imports: [ ListingDetailModule ],
       providers: [
         { provide: YacsService, useClass: YacsServiceMock },
         { provide: ActivatedRoute, useValue: mockActivatedRoute },
         { provide: ConflictsService, useClass: MockConflictsService }
       ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListingDetailComponent);
    component = fixture.componentInstance;
    //de = fixture.debugElement.query(By.css('course-list'));
    //element  = de.nativeElement;
    component.getCourseByID(null);
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("testing listing", function() {
    // Testing that the listing has generated correctly.
    expect(component.listing).toBeDefined();
    expect(component.listing[0].longname).toEqual('Mock Course');
  });
});
