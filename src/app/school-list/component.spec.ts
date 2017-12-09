
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as Stubs from '../../lib/router-stubs';

// NOTE: Getting this to work required installing:
// ```  npm install --save-dev @types/jasmine ```
// This seems to allow you to import 'jasmine'.
// After that you can just run using 'npm test'

import { YacsService } from '../services/yacs.service';
import { SchoolListComponent } from './component';
import { SchoolListModule } from './module';
import { DepartmentComponent } from './department/component';
import { SchoolComponent } from './school/component';

import { School } from './school/school'

let mockSchools: School[] = [
  {"id":1,"name":"School of Humanities, Arts and Social Sciences", "departments":null},
  {"id":2,"name":"School of Engineering", "departments":null},
  {"id":3,"name":"School of Science", "departments":null},
  {"id":4,"name":"School of Architecture", "departments":null},
  {"id":5,"name":"School of Business Management", "departments":null} ];

describe("Testing SchoolListComponent", function() {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ School ],
      declarations: [ SchoolListComponent, SchoolComponent, DepartmentComponent,
        Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent,
        Stubs.QueryParamsStubDirective ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;

    component.schools = mockSchools;
    fixture.detectChanges();
  }));

  it("should have a component", function() {
    expect(component).toBeTruthy();
  });

  it('should contain all schools', function() {
   let de: DebugElement[] = fixture.debugElement.queryAll(By.css('school'));
   for(var x of mockSchools) {
     expect(de[x.id-1].nativeElement.textContent).toContain(x.name);
   }
  });

});
