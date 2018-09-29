import { Component, Input } from '@angular/core';
import { ScheduleEvent } from '../../models/schedule-event.model';

@Component({
  selector: 'schedule-event',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  // don't need to specify ConstantsService here as long as
  // it's on the AppComponent
  providers: [
    // ConstantsService,
  ],
  host: {
    '[style.height]': `getHeight()`,
    '(mouseenter)': `changeHover(true)`,
    '(mouseleave)': `changeHover(false)`
  },
})

export class ScheduleEventComponent {
  @Input() scheduleEvent: ScheduleEvent;
  @Input() normalHeight: number;

  hover: boolean = false;

  changeHover(newHover: boolean): void {
    this.hover = newHover;
  }

  getHeight(): string {
    return this.hover ? 'auto' : this.normalHeight + 'px';
  }
}

