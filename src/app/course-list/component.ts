import { Component, Input } from '@angular/core';
import { Course } from '../course-list/course/course';
import { Section } from '../course-list/section/section';

@Component({
    selector: 'course-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class CourseListComponent {
  @Input() courses : Course[] = [];
}
