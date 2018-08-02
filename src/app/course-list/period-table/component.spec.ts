import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodTableComponent } from './period-table.component';

describe('PeriodTableComponent', () => {
  let component: PeriodTableComponent;
  let fixture: ComponentFixture<PeriodTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
