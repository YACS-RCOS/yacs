import { Component } from '@angular/core';
import { Course } from './course/component';

const COURSELIST_TEST_DATA: Course[] = [
  {
    id: 1,
    name: 'Data Structures',
    num: '1200',
    departmentCode: 'CSCI',
    minCredits: 4,
    maxCredits: 4,
    description: 'Hash maps. Hash maps everywhere.',
    sections: [
      {
        id: 1,
        courseId: 1,
        name: '01',
        crn: 1337,
        instructors: ['Cutler', 'Thompson'],
        seats: 10,
        seatsTaken: 3,
        conflicts: [34, 54, 63],
        periods: [
          { form: 'LEC', startTime: 3480, endTime: 3590 },
          { form: 'TES', startTime: 3960, endTime: 4070 },
          { form: 'LAB', startTime: 4920, endTime: 5030 },
          { form: 'LEC', startTime: 6360, endTime: 6470 }
        ]
      },
      {
        id: 2,
        courseId: 1,
        name: '02',
        crn: 1338,
        instructors: ['Cutler', 'Thompson'],
        seats: 10,
        seatsTaken: 6,
        conflicts: [34, 54, 63],
        periods: [
          { form: 'LEC', startTime: 3480, endTime: 3590 },
          { form: 'TES', startTime: 3960, endTime: 4070 },
          { form: 'LAB', startTime: 5040, endTime: 5150 },
          { form: 'LEC', startTime: 6360, endTime: 6470 }
        ]
      }
    ]
  }
];


@Component({
    selector: 'course-list',
    templateUrl: './component.html'
})
export class CourseListComponent {
  courses = COURSELIST_TEST_DATA;
}
