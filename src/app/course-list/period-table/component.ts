import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Period } from '../../models/period.model';
import { Section } from '../../models/section.model';

@Component({
  selector: 'period-table',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class PeriodTableComponent {
  constructor () { }
}
