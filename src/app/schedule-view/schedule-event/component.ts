import { Component, Input } from '@angular/core';
import { ScheduleEvent } from './schedule-event';

@Component({
  selector: 'schedule-event',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  // don't need to specify ConstantsService here as long as
  // it's on the AppComponent
  providers: [
    // ConstantsService,
  ],
})

export class ScheduleEventComponent{
	@Input() scheduleEvent: ScheduleEvent;
}