import { Component, Input } from '@angular/core';
import { Course } from '../models/course.model';
import { Section } from '../models/section.model';

@Component({
    selector: 'course-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class CourseListComponent {
  @Input() courses : Course[] = [];
}
