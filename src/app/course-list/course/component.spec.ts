
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CourseComponent } from './component';
import { Section } from '../section/section';
import { Period } from '../section/period';

import { SelectionService } from '../../services/selection.service'
import { ConflictsService } from '../../services/conflicts.service';

describe("Testing Course component", function() {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  let mockConflictsService:any;
      class MockConflictsService {
          doesConflict = jasmine.createSpy('doesConflict');
      }

  let mockSelectionService:any;
      class MockSelectionService {
          toggleCourse = jasmine.createSpy('toggleCourse');
          hasSelectedSection = jasmine.createSpy('hasSelectedSection');
          isSectionSelected = jasmine.createSpy('isSectionSelected');
          toggleSection = jasmine.createSpy('toggleSelection');
      }

      // TODO: Looks like an error...
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //      declarations: [ CourseComponent ],
  //      providers: [{ provide: ConflictsService, useValue: mockConflictsService },
  //        { provide: SelectionService, useValue: mockSelectionService }]
  //   }).compileComponents();
  //
  //   fixture = TestBed.createComponent(CourseComponent);
  //   component = fixture.componentInstance;
  //   de = fixture.debugElement.query(By.css('div'));
  //   element  = de.nativeElement;
  //
  //   let per1: Period[] = [
  //     {"type":"Lecture", "day": 1, "start":10, "end": 12},
  //     {"type":"Lecture", "day": 2, "start":10, "end": 12}
  //   ]
  //   let fake: Section[] = [{"id": 1, "course_id": 1, "name": "Mock Course 1", "crn": 99999,
  //                 "instructors": ["Inst1", "Inst2"], "seats":1, "seats_taken":1,
  //                 "conflicts":[], "periods": per1, "num_periods": 1, "course_name": "Mock Course 1",
  //                 "course_number":1, "department_code":'T'}];
  //
  //   component.course = {"id":1,"name":"Mock Course 1","num":'1',"min_credits":4,"max_credits":4,"description":"test","department_id":1, "department_code": 'T', "sections": fake};
  // }));
  //
  // it("should have a component", function() {
  //   expect(component).toBeDefined();
  // });

});
