import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Schedule } from 'yacs-api-client';
import { ScheduleSet } from '../models/schedule-set';
import { Day } from '../models/day.model';
import { Period } from '../models/period.model';
import { SelectionService } from '../services/selection.service';
import { ScheduleComponent } from '../schedule-view/schedule/component';
// import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';
import fileDownload from 'js-file-download';
import * as moment from 'moment';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'schedule-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ScheduleViewComponent implements OnInit, OnDestroy, AfterViewInit {

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.scheduleSet.incrementActiveSchedule();
    }

    if(event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.scheduleSet.decrementActiveSchedule();
    }
  }

  @ViewChildren(ScheduleComponent)
  public ScheduleList: QueryList<ScheduleComponent>

  height: number = 600;
  private emptyScheduleSet: ScheduleSet = new ScheduleSet([], this.height);

  isLoaded: boolean = false;
  scheduleSet: ScheduleSet = this.emptyScheduleSet;
  isTemporary: boolean = false;
  scheduleNode;

  showInfo: boolean = true;

  private subscription;

  constructor (
    private selectionService : SelectionService,
    private activatedRoute: ActivatedRoute) {
    this.subscription = this.selectionService.subscribe(() => {
      this.getSchedules();
    });
  }

  public ngOnDestroy (): void {
    this.subscription.unsubscribe();
  }

  public ngOnInit (): void {
    this.getSchedules();
  }

  public ngAfterViewInit (): void {
    this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) => {
      this.scheduleNode = comps.first.scheduleNode;
    });
  }

  public toggleInfoShow () : void {
    this.showInfo = false;
  }

  private getSchedules (): void {
    this.isLoaded = false;
    const sectionIds = this.selectionService.getSelectedSectionIds();
    Schedule
      .where({ section_id: sectionIds})
      .includes('sections')
      .includes('sections.listing')
      .all().then((schedules) => {
        // TODO: Handle this in yacs-api-client
        schedules.data.forEach(schedule => {
          schedule.sections.forEach(section => {
            section.periods.forEach(period => {
              period.section = section;
            });
          });
        });
        this.scheduleSet = new ScheduleSet(schedules.data, this.height);
        this.isLoaded = true;
      });
  }

  public get activeScheduleIndex (): number {
    return (this.scheduleSet.numSchedules > 0) ? this.scheduleSet.activeScheduleIndex + 1 : 0;
  }

  public get statusText (): string {
    if (this.scheduleSet.activeSections.length > 0) {
      return `CRNs: ${this.scheduleSet.activeSections.map(s => s.crn).join(', ')}`;
    }
    return "Nothing to see here. Try adding some courses :)"
  }

  public downloadImage (): void {
      var node = this.scheduleNode;

      domtoimage.toPng(node, { bgcolor:"white", quality: 1.0 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'mySchedules.png';
            link.href = dataUrl;
            link.click();
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error);
        });
  }

  public downloadICSFile (): void {
    const DATE_FORMAT = "[America/New_York:]YYYYMMDD[T]HHmmss";
    const DATE_FORMAT_2 = "YYYYMMDD[T]HHmmss[Z]"; // UTC time

    function calculateEventTime (dayOfWeek: number, periodStart: number, baseDate: number): string {
      // timezone handling: all the date data is in the local timezone, but in the ICS file we
      // specify the date as an Eastern Time (America/New_York) value
      return moment(baseDate).day(dayOfWeek).hour(0).minute(0).second(0).minute(periodStart).format(DATE_FORMAT);
    }// day(dayOfWeek)

    function toMinutes (timeString: string): number {
      let timeInt = parseInt(timeString);
      return (Math.floor(timeInt / 100) * 60) + (timeInt % 100);
    }

    function parseToOutput (val: any): string {
      // These are escapes required in the ICAL spec
      const result = String(val)
        .trim()
        .replace(/(\r\n|\n|\r)/gm," ")
        .replace(/\\/g, "\\")
        .replace(/\,/g, "\\,")
        .replace(/;/g, "\\;");
      return result ? result : '???';
    }


    const events = [];

    // these values are made up, for testing purposes
    // remember that months are ZERO-INDEXED in JS!!
    const TERM_START: number = moment([2019, 5, 1]).valueOf(); // June
    const TERM_END: number = moment([2019, 10, 1]).valueOf(); // November

    for (const period of this.scheduleSet.activePeriods) {
      events.push({
        start: calculateEventTime(period.day, toMinutes(period.start), TERM_START),
        end: calculateEventTime(period.day, toMinutes(period.end), TERM_START),
        title: String(period.section.listing.subjectShortname) + ' ' + String(period.section.listing.courseShortname) + ' - ' + String(period.section.shortname),
        description: String(period.section.crn) + ' ' + String(period.section.instructors.join(' ,')),
        location: String(period.location)
      });
    }

    let s = ''; // the schedule string

    s += 'BEGIN:VCALENDAR\r\n';
    s += 'VERSION:2.0\r\n';
    s += 'CALSCALE:GREGORIAN\r\n';

    for (const e of events) {
      s += 'BEGIN:VEVENT\r\n';
      s += 'SUMMARY:' + parseToOutput(e.title) + '\r\n';
      s += 'DTSTART;TZID=' + parseToOutput(e.start) + '\r\n';
      s += 'DTEND;TZID=' + parseToOutput(e.end) + '\r\n';
      s += 'DESCRIPTION:' + parseToOutput(e.description) + '\r\n';
      s += 'SEQUENCE:0\r\n';
      s += 'STATUS:CONFIRMED\r\n';
      s += 'RRULE:FREQ=DAILY;UNTIL=' + parseToOutput(moment(TERM_END).format(DATE_FORMAT_2)) + '\r\n';
      s += 'END:VEVENT\r\n';
    }

    s += 'END:VCALENDAR\r\n';
    fileDownload(s, 'schedule.ics');
  }

  public clearSelections (): void {
    this.selectionService.clear();
  }
}
