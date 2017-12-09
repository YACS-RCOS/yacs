
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Period } from './period';
import { Section } from './section';
import { SectionComponent } from './component';
import { ConflictsService } from '../../services/conflicts.service';

describe("Testing Section component", function() {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  class MockConflictsService {
      public doesConflict() {
        return false;
      }
  }

  let per1: Period;
  let per2: Period;
  let sec: Section;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       declarations: [ SectionComponent ],
       providers: [{ provide: ConflictsService, useClass: MockConflictsService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('span'));
    element  = de.nativeElement;

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

    component.section = sec;

    fixture.detectChanges();
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("testing functionality", function() {
    expect(component.getHours(component.section.periods[0])).toEqual('0:10a-0:12a');
    expect(component.getDay(component.section.periods[0])).toEqual('Mon');

    expect(component.getHours(component.section.periods[1])).toEqual('0:10a-0:12a');
    expect(component.getDay(component.section.periods[1])).toEqual('Tue');
  });

  it("testing html content", function() {
    expect(element.textContent).toContain("Mock Course 1");
    expect(element.textContent).toContain("Inst1, Inst2");
    expect(element.textContent).toContain("99999");
  })
});
