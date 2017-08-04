import { SchedulePeriod } from './scheduleperiod';

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

  public get getHourHeight(){
    return (60 * 100 / this.getTimeSpan);
  }

}
