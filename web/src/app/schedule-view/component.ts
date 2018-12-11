import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { YacsService } from '../services/yacs.service';
import { Course } from '../models/course.model';
import { Section } from '../models/section.model';
import { Schedule} from '../models/schedule.model';
import { ScheduleEvent } from '../models/schedule-event.model';
import { SelectionService } from '../services/selection.service';
import { ScheduleComponent } from '../schedule-view/schedule/component';
import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';

@Component({
  selector: 'schedule-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ScheduleViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(ScheduleComponent)
  public ScheduleList: QueryList<ScheduleComponent>

  isLoaded : boolean = false;
  courses : Course[] = [];
  schedules: Schedule[] = [];
  scheduleIndex: number = 0;
  isTemporary: boolean = false;
  scheduleNode;

  private subscription;

  constructor (
    private yacsService : YacsService,
    private selectionService : SelectionService,
    private activatedRoute: ActivatedRoute) {

    this.subscription = this.selectionService.subscribe(() => {
      this.getSchedules();
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  getSchedules () : void {
    const sectionIds = this.selectionService.getSelectedSectionIds();
    this.isLoaded = false;
    this.yacsService
      .get('schedules', { section_ids: sectionIds.join(','), show_periods: true })
      .then((data) => {
        this.schedules = this.processSchedules(data['schedules']);
        this.isLoaded = true;
      });
  }

  getCourses () : void {
    const courseIds = this.selectionService.getSelectedCourseIds();
    if (courseIds.length > 0) {
      this.yacsService
        .get('courses', { id: courseIds.join(','), show_sections: true, show_periods: true })
        .then((data) => {
          this.courses = data['courses'] as Course[];
        });
    }
  }

  processSchedules (rawSchedules: Object[]): Schedule[] {
    if (rawSchedules.length == 0) {
      return [new Schedule([], 480, 1200, "Try selecting some courses :)")];
    }

    const allScheduleEvents: ScheduleEvent[][] = [];
    const allStatusTexts: string[] = [];

    let earliestStart = 480;
    let latestEnd = 1320;

    for (let schedule of rawSchedules) {
      const sections = schedule['sections'] as Section[];
      const scheduleEvents: ScheduleEvent[] = [];
      const crns = [];
      let color = 0;
      for (let section of sections) {
        crns.push(section.crn);
        for (let period of section.periods) {
          const event = {
            name:      section.course_name,
            crn:       section.crn,
            day:       period.day,
            color:     color,
            startTime: this.toMinutes(period.start),
            endTime:   this.toMinutes(period.end),
            title:     `${section.department_code} ${section.course_number} - ${section.name}`,
            location: period.location
          } as ScheduleEvent;
          scheduleEvents.push(event);
        }
        if (color >= Schedule.COLORS.length-1){
          color = 0;
        }
        else{
          color++
        }
      }
      allScheduleEvents.push(scheduleEvents);
      allStatusTexts.push(`CRNs: ${crns.join(',')}`);
    }

    const schedules: Schedule[] = [];
    for (let i in allScheduleEvents) {
      schedules.push(new Schedule(allScheduleEvents[i], earliestStart, latestEnd, allStatusTexts[i]));
    }
    return schedules;
  }

  toMinutes (timeString) : number {
    let int = parseInt(timeString);
    return (Math.floor(int / 100) * 60) + (int % 100);
  };

  ngOnInit () : void {
    this.getSchedules();
    this.getCourses();
  }

  public previousSchedule () : void {
    if (this.scheduleIndex > 0) {
      --this.scheduleIndex;
    } else {
      this.scheduleIndex = this.schedules.length - 1;
    }
  }

  public nextSchedule () : void {
    if (this.scheduleIndex < this.schedules.length - 1) {
      ++this.scheduleIndex;
    } else {
      this.scheduleIndex = 0;
    }
  }

  public currentSchedule () : Schedule {
    return this.schedules[this.scheduleIndex];
  }

  public statusText () : string {
    if (!this.schedules[this.scheduleIndex]) {
      return "";
    }
    return this.schedules[this.scheduleIndex].statusText;
  }

  public downloadImage () : void {
      var node = this.scheduleNode;

      domtoimage.toPng(node,{bgcolor:"white",quality:1.0})
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

  public copyScheduleLink () : void {
      var targetUrl = window.location.protocol + '//' + window.location.host +
      '/#/schedules?section_ids=' + this.selectionService.getSelectedSectionIds().join(',') +
      '&schedule_index=' + this.scheduleIndex;

      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = targetUrl;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
  }

  // Helper padding function, for makeVCalendar
  public pad0 (num) : string {
      return ('0' + num).slice(-2);
  }

  // Helper function to make date stamp for makeVCalendar
  public makeStamp (d) : string {
      return d.getFullYear() + this.pad0(d.getMonth() + 1) + this.pad0(d.getDate()) +
        'T' + this.pad0(d.getHours()) + this.pad0(d.getMinutes()) + '00';
  }

  // Helper function to format each period into VEvent for ICS
  public makeVEvent (period, uidCounter) : string {
      var d = new Date();
      var nowstamp = this.makeStamp(d);
      var weekdayOffset = period.day - d.getDay();
      d.setDate(d.getDate() + weekdayOffset);
      d.setHours(Math.floor(period.start / 60));
      d.setMinutes(period.start % 60);

      var startstamp = this.makeStamp(d);
      d.setMinutes(d.getMinutes() + (period.end - period.start));
      var endstamp = this.makeStamp(d);
      uidCounter++;
      return 'BEGIN:VEVENT\r\n' + 'UID:event' + uidCounter +
        '@yacs.cs.rpi.edu\r\n' +
        'SUMMARY:' + period.tooltip + '\r\n' +
        'DTSTAMP:' + nowstamp + '\r\n' +
        'DTSTART:' + startstamp + '\r\n' +
        'DTEND:' + endstamp + '\r\n' + 'END:VEVENT\r\n';
  }

  public makeVCalendar () : string {
      let vCalendarData = 'BEGIN:VCALENDAR\r\n' + 'VERSION:2.0\r\n' +
        'PRODID:-//yacs/NONSGML v1.0//EN\r\n';
        // What is version number based on? May need to be changed.
      var uidCounter = 0;

      // for each period in the period array:
      for (let period of this.currentSchedule().periods){
        vCalendarData += this.makeVEvent(period, uidCounter);
      }
      vCalendarData += 'END:VCALENDAR';
      return vCalendarData;
  }

  public clear (): void {
    this.selectionService.clear();
  }
  public downloadICS(): void {
      let vCalendarData = this.makeVCalendar();
      var elt = document.createElement('a');
      elt.setAttribute('href', 'data:text/calendar;charset=utf8' + encodeURIComponent(vCalendarData));
      elt.setAttribute('download', 'yacs-schedule.ics');
      document.body.appendChild(elt);
      elt.click();
      document.body.removeChild(elt);
  }

  ngAfterViewInit() {
      this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) =>
        {
            this.scheduleNode = comps.first.scheduleNode;
        });
  }

}
