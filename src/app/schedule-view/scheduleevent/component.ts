import { Component, Input } from '@angular/core';
import { ScheduleEvent } from './scheduleevent';

@Component({
  selector: 'scheduleevent',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  // don't need to specify ConstantsService here as long as
  // it's on the AppComponent
  providers: [
    // ConstantsService,
  ],
})

export class ScheduleEventComponent{
	@Input() scheduleevent: ScheduleEvent;
}