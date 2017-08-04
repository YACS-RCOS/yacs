import { Component, Input } from '@angular/core';
import { ConstantsService } from '../../services/constants';
import { SchedulePeriod } from './scheduleperiod';
import { Schedule } from './schedule';



@Component({
  selector: 'schedule',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  // don't need to specify ConstantsService here as long as
  // it's on the AppComponent
  providers: [
    // ConstantsService,
  ],
})

export class ScheduleComponent {
  @Input() schedule: Schedule;
  constants: ConstantsService;

  // this uses constants - inject the constants service
  constructor(constants: ConstantsService) {
    this.constants = constants;
  }

  public longDayName(day: number) {
    return this.constants.longDayName(day);
  }

  public hourName(hour: number){
    hour = hour / 60;
    if (hour === 0) {
        return '12 AM';
      }
      else if (hour < 12) {
        return hour + ' AM';
      }
      else if (hour === 12) {
        return 'Noon';
      }
      else {
        return (hour - 12) + ' PM';
      }
  }

  /* Filter and return only the periods on a given day. */
  public periodsOnDay(day: number) {
    return this.schedule.periods.filter(p => (p.day === day));
  }


}
