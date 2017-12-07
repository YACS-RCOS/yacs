import { ScheduleEvent } from '../schedule-event/schedule-event';

export class Schedule {
  // these times are in minutes since midnight
  earliestStart: number;
  latestEnd: number;

  earliestDay: number;
  latestDay: number;

  height: number;

  periods: ScheduleEvent[];

  dayNums: number[];
  hourNums: number[];

  colors: string[];
  text_colors: string[];
  border_colors: string[];
  percents: number[];
  statusText: string;
  

  constructor(
    periods: ScheduleEvent[],
    earliestStart: number,
    latestEnd: number,
    statusText
  ) {
    this.periods = periods;

    // cap earliestStart and latestEnd to the nearest hours
    this.earliestStart = Math.floor(earliestStart/60) * 60;
    this.latestEnd = Math.ceil(latestEnd/60) * 60;

    this.statusText = statusText;

    // for now, hardcode Mon-Fri week
    this.earliestDay = 1;
    this.latestDay = 5;

    this.height = 600;

    this.colors = ['#ffd4df', '#ceeffc', '#fff4d0', '#dcf7da', '#f7e2f7','#ffd4df', '#ceeffc', '#fff4d0', '#dcf7da', '#f7e2f7','#ffd4df', '#ceeffc'];
    this.text_colors = ['#d1265d', '#1577aa', '#bf8a2e', '#008a2e', '#853d80', '#9d5733', '#d9652b'];
    this.border_colors = ['#ff2066', '#00aff2', '#ffcb45', '#48da58', '#d373da', '#a48363', '#ff9332'];
    this.percents = [480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140];

    this.dayNums = [];
    for(let i=this.earliestDay; i<=this.latestDay; ++i) {
      this.dayNums.push(i);
    }
    this.hourNums = [];
    console.log(latestEnd);
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
  

}
