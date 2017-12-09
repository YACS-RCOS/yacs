
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as Stubs from '../../lib/router-stubs';

import { ScheduleViewComponent } from './component';
import { Schedule } from './schedule/schedule';
import { ScheduleViewModule } from './module';
import { ConstantsService } from '../services/constants';
import { YacsService } from '../services/yacs.service';

describe("Testing schedule-view component", function() {
  let component: ScheduleViewComponent;
  let fixture: ComponentFixture<ScheduleViewComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ScheduleViewModule ],
      providers: [ ConstantsService, YacsService ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleViewComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('.schedule-menu'));
    element  = de.nativeElement;
    fixture.detectChanges();
  }));

  // it("should have a component", function() {
  //   expect(component).toBeDefined();
  // });
  //
  // it("Schedule View contains correct links", function() {
  //   expect(element.textContent).toContain("Clear");
  //   expect(element.textContent).toContain("Download ICS");
  //   expect(element.textContent).toContain("Copy Schedule Link");
  // });

});
