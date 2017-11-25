
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Period } from './period';
import { SectionComponent } from './component';
import { ConflictsService } from '../../services/conflicts.service';

describe("Testing Section component", function() {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  let mockConflictsService:any;
      class MockConflictsService {
          doesConflict = jasmine.createSpy('doesConflict');
      }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       declarations: [ SectionComponent ],
       providers: [{ provide: ConflictsService, useValue: mockConflictsService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('span'));
    element  = de.nativeElement;

    let per1: Period[] = [
      {"type":"Lecture", "day": 1, "start":10, "end": 12},
      {"type":"Lecture", "day": 2, "start":10, "end": 12}
    ]

    component.section = {"id": 1, "course_id": 1, "name": "Mock Course 1", "crn": 99999,
                  "instructors": ["Inst1", "Inst2"], "seats":1, "seats_taken":1,
                  "conflicts":[], "periods": per1, "num_periods": 1, "course_name": "Mock Course 1",
                  "course_number":1, "department_code":'T'};
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

  it("test", function() {
    // NOTE: feels like there isn't data being written here...
    console.log(element.textContent);
  })

});
