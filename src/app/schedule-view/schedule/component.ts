import { Component, Input } from '@angular/core';
import { ConstantsService } from '../../services/constants';

export class SchedulePeriod {
  name: string; // e.g. "MATH 1010 - 01"
  crn: number;
  instructor: string;
  day: number;

  // these are minutes since midnight
  startTime: number;
  endTime: number;
}

export class Schedule {
  // these times are in minutes since midnight
  earliestStart: number;
  latestEnd: number;

  earliestDay: number;
  latestDay: number;

  periods: SchedulePeriod[];

  // arrays of day numbers and hour numbers
  // needed because ngFor must iterate over a container
  dayNums: number[];
  hourNums: number[];

  constructor(
    earliestStart: number,
    latestEnd: number,
    periods: SchedulePeriod[]
  ) {
    this.periods = periods;

    // cap earliestStart and latestEnd to the nearest hours
    this.earliestStart = Math.floor(earliestStart/60) * 60;
    this.latestEnd = Math.ceil(latestEnd/60) * 60;

    // for now, hardcode Mon-Fri week
    this.earliestDay = 1;
    this.latestDay = 5;

    this.dayNums = [];
    for(let i=this.earliestDay; i<=this.latestDay; ++i) {
      this.dayNums.push(i);
    }
    this.hourNums = [];
    for(let i=this.earliestStart; i<this.latestEnd; i+=60) {
      this.hourNums.push(i);
    }
  }

  /* Return the total number of days in the schedule. */
  public get getDaySpan(): number {
    return (this.latestDay - this.earliestDay) + 1;
  }
  /* Return the total number of minutes in the schedule,
   * not including the exact minute of the latestEnd. */
  public get getTimeSpan(): number {
    return this.latestEnd - this.earliestStart;
  }
  /* Return the percentage width of a day. */
  public get getDayWidth(): number {
    return (100 / this.getDaySpan);
  }
}

@Component({
  selector: 'schedule',
  templateUrl: './component.html',
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

  /* Filter and return only the periods on a given day. */
  public periodsOnDay(day: number) {
    return this.schedule.periods.filter(p => (p.day === day));
  }
}
