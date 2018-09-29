
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AboutComponent } from './component';

describe("Testing Section component", function() {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       declarations: [ AboutComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('article'));
    element  = de.nativeElement;
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("simple data check", function() {
    expect(element.textContent).toContain("About YACS");
    expect(element.textContent).toContain("Current developers");
    expect(element.textContent).toContain("Goals");
    expect(element.textContent).toContain("History");
  });

});
