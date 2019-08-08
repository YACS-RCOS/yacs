import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Schedule, Section, Period } from 'yacs-api-client';
import { ScheduleSet } from '../../models/schedule-set';
import { Day } from '../../models/day.model';
import { SelectionService } from '../../services/selection.service';
import { ColorService } from '../../services/color.service';
import { ScheduleEventComponent } from '../schedule-event/component';

@Component({
  selector: 'schedule',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  providers: []
})

export class ScheduleComponent implements AfterViewInit {

  @Input() scheduleSet: ScheduleSet;
  @ViewChild('mySchedule')
  public mySchedule: ElementRef
  @ViewChild('schedule_event')
  public schedEvent: ElementRef;
  @ViewChild(ScheduleEventComponent)
  public schedEventComponent: ScheduleEventComponent;
  public scheduleNode;
  public currentPeriod = null;
  public currentBlockColor = null;

  constructor (private colorService: ColorService) { }

  ngAfterViewInit() {
    this.scheduleNode = this.mySchedule.nativeElement;
  }

  public mouseEnter (period: Period): void {
    this.currentPeriod = period;
    this.currentBlockColor = this.getBackgroundColor(period);
  }
  
  public mouseLeft (): void {
    this.currentPeriod = null;
    this.currentBlockColor = null;
  }

  public get schedule (): Schedule {
    return this.scheduleSet.activeSchedule;
  }

  public get periods (): Period[] {
    return this.scheduleSet.activePeriods;
  }

  public get days (): Day[] {
    const days = [];
    for (let day = this.scheduleSet.startDay; day <= this.scheduleSet.endDay; ++day) {
      days.push(new Day(day));
    }
    return days;
  }

  public get hours (): string[] {
    const hours = [];
    for (let time = this.scheduleSet.startTime; time < this.scheduleSet.endTime; time += 60) {
      hours.push(this.hourName(time));
    }
    return hours;
  }

  public get dayWidth (): number {
    return (100 / this.scheduleSet.numDays);
  }

  public get hourHeight (): number {
    return (60 * 100 / this.scheduleSet.numMinutes);
  }

  public get totalHeight (): number {
    return this.scheduleSet.height;
  }

  public periodsOnDay (day: Day) {
    return this.periods.filter(p => (p.day === day.num));
  }

  public eventPosition (period: Period): number {
    const eventStart = this.toMinutes(period.start);
    return (this.scheduleSet.height * ((eventStart - this.scheduleSet.startTime) / this.scheduleSet.numMinutes));
  }

  public eventHeight (period: Period): number {
    const eventDuration = this.toMinutes(period.end) - this.toMinutes(period.start);
    var scheduleEventHeight = (this.scheduleSet.height  * (eventDuration / this.scheduleSet.numMinutes))
    if (period == this.currentPeriod) {
      var professorNamesLength = period.section.instructors.join(', ').length;
      if (scheduleEventHeight < 87) {
        if (professorNamesLength > 22) {
          return 87;
        } else if (professorNamesLength < 22 && scheduleEventHeight < 68) {
          return 68;
        } 
      }
    }
    return scheduleEventHeight;
  }

  public setZIndex (period: Period): number {
    if (period == this.currentPeriod) {
      return 1;
    }
  }

  public lowerOpacity(period: Period): number {
    if (this.currentBlockColor == this.getBackgroundColor(period) || !this.currentBlockColor) {
      return 1;
    } else {
      return 0.5;
    }
  }

  public getBackgroundColor (period: Period) {
    return this.colorService.getColor(period.section.listing.id).primary;
  }

  public getBorderColor (period: Period) {
    return this.colorService.getColor(period.section.listing.id).border;
  }

  public getTextColor (period: Period) {
    return this.colorService.getColor(period.section.listing.id).text;
  }

  private hourName (minutes: number) {
    const hour = minutes / 60;
    if (hour === 0) {
      return '12 AM';
    } else if (hour < 12) {
      return hour + ' AM';
    } else if (hour === 12) {
      return 'Noon';
    } else {
      return (hour - 12) + ' PM';
    }
  }

  private toMinutes (timeString: string): number {
    let timeInt = parseInt(timeString);
    return (Math.floor(timeInt / 100) * 60) + (timeInt % 100);
  }
}
