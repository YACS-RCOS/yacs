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
  isLoaded : boolean = true;
  courseSelections : Object[];
  courseIds: Object[];
  sections : Object[];
  foo: Object[] = [];
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
    let params = this.selectionService.getSectionSelections();
     let newParams2 : Object = {
      show_periods: true
    };
    console.log(params);
    Object.assign(newParams2, {section_ids: params});
      this.yacsService
        .get('schedules', newParams2)
        .then((data) => {
          console.log(data);
        this.foo = this.foo.concat(data['schedules']);
        console.log(this.foo);
          for(let x in this.foo){
            console.log(x);
          }
          this.processSchedules();
        });
    this.sections = [];
    this.courses = [];
    this.courseIds = [];
    let newParams : Object = {
      show_sections: true,
      show_periods: true
    };
    let i = 0;
    this.isLoaded = true;
    let len = Object.keys(this.courseSelections).length;
    for(let key of Object.keys(this.courseSelections)){
      Object.assign(newParams, {id: this.courseSelections[key]}); 
      this.yacsService
        .get('sections', newParams)
        .then((data) => {
          this.sections = this.sections.concat(data['sections']);
          if(++i == len){
           //this.processSchedules();
          }
        });
      Object.assign(newParams, {id: key}); 
      this.yacsService
        .get('courses', newParams)
        .then((data) => {
          this.courses = this.courses.concat(data['courses']) as Course[];
      });
    }

  }

  processSchedules () {
    
    this.crns = "CRNs: ";
    this.schedules = [];
    for(let sched in this.foo){
      console.log("here");
      let periods =[];
      let earliestStart = 480;
      let latestEnd = 1320;
      let periodcolor = 0;
      console.log(this.foo[sched]);
      for (let s of this.foo[sched]['sections']) {
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
      //this.isLoaded = true;
      this.schedules.push(new Schedule(480, 1320, periods));
      //console.log(this.schedules);
    }
  }

  toMinutes(timeString) {
    let int = parseInt(timeString);
    return (Math.floor(int / 100) * 60) + (int % 100);
  };


  ngOnInit () : void {
    this.courseSelections = this.selectionService.getSelections();
    
    // let foo = [];
    // this.yacsService
    //     .get('section_ids', params)
    //     .then((data) => {
    //     foo = foo.concat(data['section_ids']);
    //       console.log(foo);
    //     });
    
    console.log("HI");
        
    this.getCourses();

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
