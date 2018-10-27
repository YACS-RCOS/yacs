
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './component';

describe("Testing footer component", function() {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       declarations: [ FooterComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('div'));
    element  = de.nativeElement;
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("should contain text", function() {
    expect(element.textContent).toContain("Learn more about YACS");
    expect(element.textContent).toContain("RCOS project");
  });
});
