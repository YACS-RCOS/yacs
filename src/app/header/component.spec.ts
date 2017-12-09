
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';

import * as Stubs from '../../lib/router-stubs';

import { HeaderComponent } from './component';

let mockRouter:any;
    class MockRouter {
        navigate = jasmine.createSpy('navigate');
    }

describe("Testing header component", function() {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       providers: [ { provide: Router, useValue: mockRouter } ],
       declarations: [ HeaderComponent, Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('nav'));
    element  = de.nativeElement;
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("should contain links", function() {
    expect(element.textContent).toContain("YACS beta");
    expect(element.textContent).toContain("Schedule");
  });
});
