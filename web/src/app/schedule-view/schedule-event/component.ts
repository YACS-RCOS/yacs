import { Component, Input } from '@angular/core';
import { Listing, Period } from 'yacs-api-client';

@Component({
  selector: 'schedule-event',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  providers: [],
  host: {
    '[style.height]': `height`,
    '(mouseenter)': `hover = true`,
    '(mouseleave)': `hover = false`
  },
})

export class ScheduleEventComponent {
  @Input() period: Period;
  @Input() normalHeight: number;

  hover: boolean = false;

  public get height (): string {
    return this.hover ? 'auto' : this.normalHeight + 'px';
  }
}
