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
      const statusText = this.selectionService.getSelectedSectionIds().length == 0 ?
        "Try selecting some courses :)" : "No possible schedules :(";
      return [new Schedule([], 480, 1200, statusText)];
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

  public clear (): void {
    this.selectionService.clear();
  }

  ngAfterViewInit() {
      this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) =>
        {
            this.scheduleNode = comps.first.scheduleNode;
        });
  }

}
