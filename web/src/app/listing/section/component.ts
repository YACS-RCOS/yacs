import { Component, Input, OnInit } from '@angular/core';

import { Section, Period } from 'yacs-api-client';
import { ConflictsService } from '../../services/conflicts.service';
import { SelectionService } from '../../services/selection.service';

const SHORT_DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'section',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SectionComponent {
  @Input() section: Section;
  periods: any[][];

  constructor(private conflictsService: ConflictsService, private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.periods = this.constructPeriodsArray();
  }

  public getDay(period: any) : string {
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

  public getHours (period: any) : string {
    return this.timeToString(period.start) + '-' + this.timeToString(period.end);
  }

  public doesConflict () {
    return this.conflictsService.doesConflict(this.section);
  }

  public isSelected () {
    return this.selectionService.isSectionSelected(this.section);
  }

  private constructPeriodsArray(): any[][] {
    const periodsByDay = [Array(5)];
    this.section.periods.forEach(period => {
      if (period.day >= 1 && period.day <= 5) {
        if (periodsByDay.slice(-1)[0][period.day-1]) {
          periodsByDay.push(Array(5));
        }
        periodsByDay.slice(-1)[0][period.day-1] = period;
      }
    });
    return periodsByDay;
  }
}
