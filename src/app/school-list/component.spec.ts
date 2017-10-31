
import {} from 'jasmine';
import { Http, Response } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Component, OnInit } from '@angular/core';

// NOTE: Getting this to work required installing:
// ```  npm install --save-dev @types/jasmine ```
// This seems to allow you to import 'jasmine'.
// After that you can just run using 'npm test'

import { YacsService } from '../services/yacs.service';
import { SchoolListComponent } from './component';
import { School } from './school';
import { Department } from './department/department';

describe("Testing getSchools()", function() {

  class YacsServiceMock {
    get(path:string, params:Object = {}) : Promise<Object> {
      var json_data:Object =
        {"schools": [
          {"id":1,"name":"School of Humanities, Arts and Social Sciences"},
          {"id":2,"name":"School of Engineering"},
          {"id":3,"name":"School of Science"},
          {"id":4,"name":"School of Architecture"},
          {"id":5,"name":"School of Business Management"},
          {"id":6,"name":"Other"} ]
        };
      return Promise.resolve(json_data);
    }
  }

  let schoolListComponent : SchoolListComponent;

  beforeEach(function() {
    TestBed.configureTestingModule({
      imports:[ HttpModule ],
      providers:[ SchoolListComponent, { provide: YacsService, useClass: YacsServiceMock } ]
    });
    schoolListComponent = TestBed.get(SchoolListComponent);
  }); // mocking YacsService with constant return value for testing

  it("instantiated testbed", function() {
    expect(schoolListComponent).toBeDefined();
  });

  it("getSchool() works successfully", fakeAsync(() => {
    schoolListComponent.getSchools();
    tick(); // force getSchools to be called

    expect(schoolListComponent.schools).toBeDefined();

     // Expecting data to be undefined as we have mocked Http object
     // So apparently the correct data is in the object, but i can't access the object...
     // so schoolListComponent.getSchools() runs correctly
  }));

  it("ngOnInit() works successfully", fakeAsync (() => {
    var getSchoolCalled = jasmine.createSpy('getSchools');
    schoolListComponent.ngOnInit();
    tick(); // forces ngOnInit to complete.

    expect(schoolListComponent.schools).toBeDefined();
  }));

  // integration test - testing that html generated is correct (from ./component.html)

});

/*
TODO: integration tests for components
describe("Testing getSchools()", function() {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolListComponent],
    });

    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;
  });

  it("TEST", function() {

  });

});
*/
