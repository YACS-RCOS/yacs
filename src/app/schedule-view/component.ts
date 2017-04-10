import { Component } from '@angular/core';
import { Schedule, SchedulePeriod } from './schedule/component';

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
})
export class ScheduleViewComponent {
  scheduleIndex: number = 0;
  totalSchedules: number = 0;
  isTemporary: boolean = false;
  status: string = "";
  schedules: Schedule[] = SCHEDULE_TEST_DATA;

  public get currentSchedule(): Schedule {
    return this.schedules[this.scheduleIndex];
  }
}
