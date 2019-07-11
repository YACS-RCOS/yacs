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
import { createEvents } from '../../lib/ics';
import fileDownload from 'js-file-download';

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
    function calculateEventTime (dayOfWeek: number, periodStart: number): number[] {
      const date = new Date();
      const curDayOfWeek = date.getDay();
      const ago = curDayOfWeek === dayOfWeek ? 7 : (curDayOfWeek > dayOfWeek ? curDayOfWeek - dayOfWeek : 7 - dayOfWeek + curDayOfWeek);
      const dateAgo = new Date(date.getTime() - 1000 * 3600 * 24 * ago);
      const result = [dateAgo.getFullYear(), dateAgo.getMonth() + 1, dateAgo.getDate(), Math.floor(periodStart / 60), periodStart % 60];
      return result;
    }

    function toMinutes (timeString: string): number {
      let timeInt = parseInt(timeString);
      return (Math.floor(timeInt / 100) * 60) + (timeInt % 100);
    }


    const events = [];

    for (const period of this.scheduleSet.activePeriods) {
      events.push({
        start: calculateEventTime(period.day, toMinutes(period.start)),
        end: calculateEventTime(period.day, toMinutes(period.end)),
        title: String(period.section.listing.subjectShortname) + ' ' + String(period.section.listing.courseShortname) + ' - ' + String(period.section.shortname),
        description: String(period.section.crn) + ' ' + String(period.section.instructors.join(' ,')),
        recurrenceRule: 'FREQ=WEEKLY',
        location: String(period.location)
      });
    }

    createEvents(events, (error, data) => {
      if (error) {
        alert('Error in creating ICS file');
        console.error('ICS error', error);
      } else {
        fileDownload(data, 'schedule.ics');
      }
    });
  }

  public clearSelections (): void {
    this.selectionService.clear();
  }
}
