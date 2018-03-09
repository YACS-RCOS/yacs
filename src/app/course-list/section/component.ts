import { Component, Input } from '@angular/core';

import { Section } from './section';
import { Period } from './period';
import { ConflictsService } from '../../services/conflicts.service';

const SHORT_DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'section',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SectionComponent {
  @Input() section: Section;

  constructor(private conflictsService: ConflictsService) { }

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

  public doesConflict(secId: number) {
    return this.conflictsService.doesConflict(secId);
  }
}
