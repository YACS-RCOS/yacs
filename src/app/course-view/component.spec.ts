
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import * as Stubs from '../../lib/router-stubs';

import { CourseViewModule } from './module';
import { Course } from '../course-list/course/course';
import { CourseViewComponent } from './component';
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

describe("Testing Course-View component", function() {
  let component: CourseViewComponent;
  let fixture: ComponentFixture<CourseViewComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       imports: [ CourseViewModule ],
       providers: [
         { provide: YacsService, useClass: YacsServiceMock },
         { provide: ActivatedRoute, useValue: mockActivatedRoute },
         { provide: ConflictsService, useClass: MockConflictsService }
       ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseViewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('course-list'));
    element  = de.nativeElement;
    component.getCourses(null);
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("testing courses", function() {
    // Testing that courses has generated correctly.
    expect(component.courses).toBeDefined();
    expect(component.courses.length).toEqual(1);
    expect(component.courses[0].name).toEqual('Mock Course');
  });
});
