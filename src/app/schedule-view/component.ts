import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { YacsService } from '../services/yacs.service';
import { Course } from '../course-list/course/course';
import { Schedule} from './schedule/schedule';
import { ScheduleEvent } from './scheduleevent/scheduleevent';
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
  courseSelections : Object[];
  courseIds: Object[];
  sections : Object[];
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

    this.subscription = this.selectionService.subscribe(
      msg => {this.courseSelections = this.selectionService.getSelections(); this.getCourses();});
  }

 ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  getCourses () {
    this.sections = [];
    this.courses = [];
    this.courseIds = [];
    let newParams : Object = {
      show_sections: true,
      show_periods: true
    };
    let i = 0;
    this.isLoaded = false;
    let len = Object.keys(this.courseSelections).length;
    for(let key of Object.keys(this.courseSelections)){
      Object.assign(newParams, {id: this.courseSelections[key]}); 
      this.yacsService
        .get('sections', newParams)
        .then((data) => {
          this.sections = this.sections.concat(data['sections']);
          if(++i == len){
           this.processSchedules();
          }
        });
      Object.assign(newParams, {id: key}); 
      this.yacsService
        .get('courses', newParams)
        .then((data) => {
          this.courses = this.courses.concat(data['courses']) as Course[];
      });
    }
    
    for(let obj of this.courseIds) {
      
      
    }

  }

  processSchedules () {
    this.crns = "CRNs: ";
    this.schedules = [];
    let periods =[];
    let earliestStart = 480;
    let latestEnd = 1320;
    let periodcolor = 0;
    for (let s of this.sections) {
      periodcolor++;
      if(periodcolor == 1){
          this.crns += s['crn'];
      }
      else{
        this.crns += ', ' + s['crn'];
      }
      for(let p of s['periods']){
        let period = {
          name: s['course_name'],
          crn: s['crn'],
          instructor: s['instructors'][0],
          day: p['day'],
          startTime: this.toMinutes(p['start']),
          endTime: this.toMinutes(p['end']),
          color: periodcolor,
          title: s['department_code'] + ' ' + s['course_number'] + ' - ' + s['name'],
        }
        if(earliestStart > this.toMinutes(p['start'])){
          earliestStart = this.toMinutes(p['start']);
        }
        if(latestEnd < this.toMinutes(p['end'])){
          latestEnd = this.toMinutes(p['end']);
        }
        periods.push(period);
      }
    }
    this.isLoaded = true;
    this.schedules.push(new Schedule(earliestStart, latestEnd, periods));

  }

  toMinutes(timeString) {
    let int = parseInt(timeString);
    return (Math.floor(int / 100) * 60) + (int % 100);
  };

  ngOnInit () : void {
    this.courseSelections = this.selectionService.getSelections();
    this.getCourses();

  }

  scheduleIndex: number = 0;
  totalSchedules: number = 0;
  isTemporary: boolean = false;

}
