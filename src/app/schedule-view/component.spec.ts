
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as Stubs from '../../lib/router-stubs';

import { ScheduleViewComponent } from './component';
import { Schedule } from './schedule/component';
import { ScheduleViewModule } from './module';
import { ConstantsService } from '../services/constants';

describe("Testing currentSchedule", function() {
  let schedule : ScheduleViewComponent;

  beforeEach(function() {
    TestBed.configureTestingModule({
      providers:[ ScheduleViewComponent ]
    });
    schedule = TestBed.get(ScheduleViewComponent);
  });

  it("instantiated testbed", function() {
    expect(schedule).toBeDefined();
  });

  it("currentSchedule() works successfully", fakeAsync(() => {
    var x = schedule.currentSchedule;
    tick(); // force currentSchedule to be called

    expect(schedule.schedules).toBeDefined();
  }));

});

describe("Testing schedule-view component", function() {
  let component: ScheduleViewComponent;
  let fixture: ComponentFixture<ScheduleViewComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ScheduleViewModule ],
      providers: [ ConstantsService ],
      declarations: [ Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent, Stubs.QueryParamsStubDirective ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleViewComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('.schedule-menu'));
    element  = de.nativeElement;
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("Schedule View contains correct links", function() {
    expect(element.textContent).toContain("Clear");
    expect(element.textContent).toContain("Download ICS");
    expect(element.textContent).toContain("Copy Schedule Link");
  });

  // it("Contains Correct Schedule Number", fakeAsync(() => {
  //   component.scheduleIndex = 1;
  //   component.totalSchedules = 15;
  //   tick();
  //
  //   console.log(component.scheduleIndex);
  //   console.log(element.textContent);
  // }));
});
