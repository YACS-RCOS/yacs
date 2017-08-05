import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SchedulePeriod } from './schedule/scheduleperiod';
import { YacsService } from '../services/yacs.service';
import { Course } from '../course-list/course/course';
import { Schedule} from './schedule/schedule';

const SCHEDULE_TEST_DATA: Schedule[] = [
  // must instantiate Schedule with new + constructor
  // since it has getter properties that would otherwise have to be declared
  // in this array
  new Schedule(480, 1200, [
      {
        name: 'sdfsdf',
        crn: 54,
        instructor: 'Dr Sdfsdf',
        day: 1,
        startTime: 480,
        endTime: 540
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
  params: Object = {department_id: 62};

  constructor (
    
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute) { }

  getCourses () {
    let newParams : Object = {
      show_sections: true,
      show_periods: true
    };
    // add show_sections and show_periods to params
    Object.assign(newParams, this.params); // cannot directly modify params
    this.yacsService
        .get('courses', newParams)
        .then((data) => {
          this.courses = data['courses'] as Course[];
        });
  }

  ngOnInit () : void {
    this.getCourses();
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
