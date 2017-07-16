import { Component, Input } from '@angular/core';
import { Course } from '../course-list/course/course';


@Component({
    selector: 'course-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class CourseListComponent {

  @Input() courses : Course[];
}
