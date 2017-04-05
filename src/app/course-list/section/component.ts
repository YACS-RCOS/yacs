import { Component, Input } from '@angular/core';

export class Period {
  form: string;
  // start and end are in MINUTES SINCE START OF THE WEEK
  startTime: number;
  endTime: number;
}

export class Section {
  id: number;
  courseId: number;
  name: string;
  crn: number;
  instructors: string[];
  seats: number;
  seatsTaken: number;
  conflicts: number[];
  periods: Period[];
}

const SHORT_DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sam'];
const MINUTES_PER_DAY: number = 1440;

@Component({
  selector: 'section',
  templateUrl: './component.html',
})
export class SectionComponent {
  @Input() section: Section;

  public getDay(period: Period) : string {
    console.log(period);
    // Assume that the period doesn't include midnight, so only worry about the start time.
    return SHORT_DAYS[Math.floor(period.startTime / MINUTES_PER_DAY)];
  }

  /**
   * Convert minutes-since-start-of-week number to an ordinary time.
   * 600 = 10a
   * 610 = 10:10a
   * 720 = 12p
   * etc
   * This should possibly be a service.
   */
  private timeToString(weekMinutes: number) : string {
    let dayMinutes = weekMinutes % MINUTES_PER_DAY;
    let hour = Math.floor(dayMinutes / 60);
    let minutes = dayMinutes % 60;
    let ampm = 'a';
    let minuteShow = '';
    if (hour >= 12) {
      ampm = 'p';
      if (hour > 12) {
        hour -= 12;
      }
    }
    if(minutes === 0) {
      minuteShow = '';
    }
    else {
      minuteShow = ':' + (minutes < 10 ? '0' : '') + minutes;
    }
    return hour + minuteShow + ampm;
  }

  public getHours(period: Period) : string {
    return this.timeToString(period.startTime) + '-' + this.timeToString(period.endTime);
  }
}
