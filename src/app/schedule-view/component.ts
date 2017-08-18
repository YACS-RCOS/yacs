import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { YacsService } from '../services/yacs.service';
import { Course } from '../course-list/course/course';
import { Schedule} from './schedule/schedule';
import { ScheduleEvent } from './scheduleevent/scheduleevent';

const SCHEDULE_TEST_DATA: Schedule[] = [
  // must instantiate Schedule with new + constructor
  // since it has getter properties that would otherwise have to be declared
  // in this array
  new Schedule(480, 1320, [
      {
        name: 'test1',
        crn: 54,
        instructor: 'Dr Sdfsdf',
        day: 1,
        startTime: 1200,
        endTime: 1320,
        color: 0,
      },
      {
        name: 'test2',
        crn: 55,
        instructor: 'Dr Sdfsdf',
        day: 2,
        startTime: 480,
        endTime: 640,
        color: 0,
      }
    ]
  ),
  new Schedule(480, 1200, [
      {
        name: 'sdfsdf',
        crn: 54,
        instructor: 'Dr Sdfsdf',
        day: 1,
        startTime: 580,
        endTime: 640,
        color: 0,
      }
    ]
  )
];

@Component({
  selector: 'schedule-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ScheduleViewComponent {

  courses : Course[] = [];
  paramCourses: Object[] = [{id: 303}, {id:393}];


  constructor (
    
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute) { }

  getCourses () {
    let newParams : Object = {
      show_sections: true,
      show_periods: true
    };
    // add show_sections and show_periods to params
    for(let obj of this.paramCourses) {
      Object.assign(newParams, obj); // cannot directly modify params
      this.yacsService
          .get('courses', newParams)
          .then((data) => {
            this.courses = this.courses.concat(data['courses']) as Course[];
          });
    }
  }

  ngOnInit () : void {
    this.getCourses();

    // TO DO 
    // Add this in: 
      // this.activatedRoute.queryParams.subscribe((params: Params) => {
      // this.getCourses(params);
      // });
  }

  scheduleIndex: number = 0;
  totalSchedules: number = 0;
  isTemporary: boolean = false;
  status: string = "CRNs";
  schedules: Schedule[] = SCHEDULE_TEST_DATA;

  public get currentSchedule(): Schedule {
    return this.schedules[this.scheduleIndex];
  }


}
