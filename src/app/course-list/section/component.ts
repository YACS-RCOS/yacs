import { Component, Input } from '@angular/core';

export class Period {
  type: string;
  day: number;
  // start and end are in MINUTES SINCE START OF THE WEEK // no?
  start: number;
  end: number;
}

export class Section {
  id: number;
  course_id: number;
  name: string;
  crn: number;
  instructors: string[];
  seats: number;
  seats_taken: number;
  conflicts: number[];
  periods: Period[];
  num_periods: number;
  course_name: string;
  course_number: number;
  department_code: string;
}

const SHORT_DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sam'];
const MINUTES_PER_DAY: number = 1440;

@Component({
  selector: 'section',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SectionComponent {
  @Input() section: Section;

  public getDay(period: Period) : string {
    return SHORT_DAYS[period.day];
  }

  /**
   * Convert minutes-since-start-of-week number to an ordinary time.
   * 600 = 10a
   * 610 = 10:10a
   * 720 = 12p
   * etc
   * This should possibly be a service.
   */
  private timeToString(time: number) : string {
    let hour = Math.floor(time / 100);
    let minute = Math.floor(time % 100);

    let ampm = 'a';
    if (hour >= 12) {
      ampm = 'p';
      if (hour > 12) {
        hour -= 12;
      }
    }

    let minuteShow = '';
    if (minute != 0) {
      minuteShow = ':' + (minute < 10 ? '0' : '') + minute;
    }

    return hour + minuteShow + ampm;
  }

  public getHours(period: Period) : string {
    return this.timeToString(period.start) + '-' + this.timeToString(period.end);
  }
}
