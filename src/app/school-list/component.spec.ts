
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as Stubs from '../../lib/router-stubs';

// NOTE: Getting this to work required installing:
// ```  npm install --save-dev @types/jasmine ```
// This seems to allow you to import 'jasmine'.
// After that you can just run using 'npm test'

import { YacsService } from '../services/yacs.service';
import { SchoolListComponent } from './component';
import { SchoolListModule } from './module';
import { DepartmentComponent } from './department/component';

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

describe("Testing getSchools()", function() {
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
});

//TODO: integration tests for components
describe("Testing getSchools()", function() {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: YacsService, useClass: YacsServiceMock } ],
      declarations: [ SchoolListComponent, DepartmentComponent, Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent, Stubs.QueryParamsStubDirective ]
    }).compileComponents();
    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('.schools'));
    element  = de.nativeElement;

    component.getSchools(); // generating School[] array
  }));

  it("should have a component", function() {
    expect(component).toBeTruthy();
  });

  it('should contain all schools', () => {
   fixture.detectChanges();

   for(var x of component.schools) {
     expect(element.textContent).toContain(x.name);
   }
 })

});
