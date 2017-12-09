
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
import { Course } from './course/course';

import { SelectionService } from '../services/selection.service';
import { ConflictsService } from '../services/conflicts.service';

describe("Testing Course-List component", function() {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  let per1: Period;
  let per2: Period;
  let sec: Section;
  let course_1:Course;

  class MockConflictsService {
      public doesConflict() {
        return false;
      }
  }

  class MockSelectionService {
      public toggleCourse() {
        return true;
      }
      public hasSelectedSection() {
        return true;
      }
      public isSectionSelected() {
        return true;
      }
      public toggleSection() {
        return true;
      }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       imports: [ CourseListModule ],
       providers: [{ provide: ConflictsService, useClass: MockConflictsService },
         { provide: SelectionService, useClass: MockSelectionService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    element  = fixture.nativeElement;

    per1 = new Period();
    per1.type = "Lecture";
    per1.day = 1;
    per1.start = 10;
    per1.end = 12;
    per2 = new Period();
    per2.type = "Lecture";
    per2.day = 2;
    per2.start = 10;
    per2.end = 12;
    let per: Period[] = [
      per1,
      per2
    ];

    sec = new Section();
    sec.id = 1;
    sec.course_id = 1;
    sec.name = "Mock Course 1";
    sec.crn = 99999;
    sec.instructors = ["Inst1", "Inst2"];
    sec.seats = 10;
    sec.seats_taken = 5;
    sec.conflicts = [];
    sec.periods = per;
    sec.num_periods = 2;
    sec.course_name = "Mock Course 1 1";
    sec.course_number = 1;
    sec.department_code = "TEST";
    let fake: Section[] = [sec];

    course_1 = new Course();
    course_1.id = 1;
    course_1.name = "Mock Course 1";
    course_1.num = '1';
    course_1.min_credits = 4;
    course_1.max_credits = 4;
    course_1.description = "This is a test mock course!";
    course_1.department_id = 1;
    course_1.department_code = "TEST";
    course_1.sections = fake;

    component.courses = [ course_1 ];
    fixture.detectChanges();
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("course[] should have courses", function() {
    expect(component.courses.length > 0);
  });

  it("testing correct html content", function() {
    expect(element.textContent).toContain("This is a test mock course!");
    expect(element.textContent).toContain("99999");
    expect(element.textContent).toContain("4 credits");
    expect(element.textContent).toContain("Mon");
    expect(element.textContent).toContain("Tue");
  })
});
