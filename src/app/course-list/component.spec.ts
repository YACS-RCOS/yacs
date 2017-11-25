
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import * as Stubs from '../../lib/router-stubs';

import { CourseListModule } from './module';
import { CourseListComponent } from './component';
import { Section } from './section/section';
import { Period } from './section/period';

describe("Testing Course-List component", function() {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       imports: [ CourseListModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;

    let per1: Period[] = [
      {"type":"Lecture", "day": 1, "start":10, "end": 12},
      {"type":"Lecture", "day": 2, "start":10, "end": 12}
    ]
    let fake: Section[] = [{"id": 1, "course_id": 1, "name": "Mock Course 1", "crn": 99999,
                  "instructors": ["Inst1", "Inst2"], "seats":1, "seats_taken":1,
                  "conflicts":[], "periods": per1, "num_periods": 1, "course_name": "Mock Course 1",
                  "course_number":1, "department_code":'T'}];

    component.courses = [
      {"id":1,"name":"Mock Course 1","num":'1',"min_credits":4,"max_credits":4,"description":"test","department_id":1, "department_code": 'T', "sections": fake},
    ];
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("course[] should have courses", function() {
    expect(component.courses.length > 0);
  });
});
