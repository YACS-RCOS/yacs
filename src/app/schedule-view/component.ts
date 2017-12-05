import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { YacsService } from '../services/yacs.service';
import { Course } from '../course-list/course/course';
import { Section } from '../course-list/section/section';
import { Schedule} from './schedule/schedule';
import { ScheduleEvent } from './schedule-event/schedule-event';
import { SelectionService } from '../services/selection.service';
import 'rxjs/Rx';
import {Subject,Subscription} from 'rxjs/Rx';



@Component({
  selector: 'schedule-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ScheduleViewComponent implements OnInit, OnDestroy{

  courses : Course[];
  isLoaded : boolean = false;
  // courseSelections : Object[];
  // courseIds: Object[];
  // sections : Object[];
  // foo: Object[] = [];
  processedSchedules: Schedule[]  = [];
  crns : string;
  schedules: Schedule[];
  start: number = 480; //8AM    
  end: number = 1200; //8PM

  private subscription;


  constructor (
    private yacsService : YacsService,
    private selectionService : SelectionService,
    private activatedRoute: ActivatedRoute) { 

    this.subscription = this.selectionService.subscribe(() => {
      this.getSchedulesAndCourses();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSchedulesAndCourses () {
    this.isLoaded = false;
    const selections = this.selectionService.getSelections();
    const sectionIds = [];
    for (let selection of selections) {
      sectionIds.push(...selection);
    }
    const queryParams = { section_id: sectionIds.join(','), show_section: true };

    this.yacsService
      .get('schedules', queryParams)
      .then((data) => {
        this.schedules = this.processSchedules(data['schedules']);
        this.isLoaded = true;
      });

    this.yacsService
      .get('courses', queryParams)
      .then((data) => {
        this.courses = data['courses'] as Course[];
      });
  }

  processSchedules (rawSchedules: Object[]): Schedule[] {
    const allScheduleEvents: ScheduleEvent[][] = [];
    const allStatusTexts: number[][] = [];

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
            title:     `${section.department_code} ${section.course_number} - ${section.name}`
          } as ScheduleEvent;
          scheduleEvents.push(event);
        }
        ++color;
      }
      allScheduleEvents.push(scheduleEvents);
    }

    const schedules: Schedule[] = [];
    for (let i in allScheduleEvents) {
      schedules.push(new Schedule(allScheduleEvents[i], earliestStart, latestEnd));
    }

    return schedules;
  }

  // processSchedules () {
    
  //   this.crns = "CRNs: ";
  //   this.schedules = [];
  //   for(let sched in this.foo){
  //     console.log("here");
  //     let periods =[];
  //     let earliestStart = 480;
  //     let latestEnd = 1320;
  //     let periodcolor = 0;
  //     console.log(this.foo[sched]);
  //     for (let s of this.foo[sched]['sections']) {
  //       periodcolor++;
  //       if(periodcolor == 1){
  //           this.crns += s['crn'];
  //       }
  //       else{
  //         this.crns += ', ' + s['crn'];
  //       }
  //       for(let p of s['periods']){
  //         let period = {
  //           name: s['course_name'],
  //           crn: s['crn'],
  //           instructor: s['instructors'][0],
  //           day: p['day'],
  //           startTime: this.toMinutes(p['start']),
  //           endTime: this.toMinutes(p['end']),
  //           color: periodcolor,
  //           title: s['department_code'] + ' ' + s['course_number'] + ' - ' + s['name'],
  //         }
  //         if(earliestStart > this.toMinutes(p['start'])){
  //           earliestStart = this.toMinutes(p['start']);
  //         }
  //         if(latestEnd < this.toMinutes(p['end'])){
  //           latestEnd = this.toMinutes(p['end']);
  //         }
  //         periods.push(period);
  //       }
  //     }
  //     //this.isLoaded = true;
  //     this.schedules.push(new Schedule(480, 1320, periods));
  //     //console.log(this.schedules);
  //   }
  // }

  toMinutes(timeString) {
    let int = parseInt(timeString);
    return (Math.floor(int / 100) * 60) + (int % 100);
  };


  ngOnInit () : void {
    this.getSchedulesAndCourses();
  }

  scheduleIndex: number = 0;
  totalSchedules: number = 0;
  isTemporary: boolean = false;

  public dec(event) {
    this.scheduleIndex = this.scheduleIndex - 1;
  }
  
  public inc(event) {
    this.scheduleIndex = this.scheduleIndex + 1;
  }
}
