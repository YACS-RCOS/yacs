import { Component, Input } from '@angular/core';
import { Course } from '../course-list/course/course';
import { Section } from '../course-list/section/section';
import { SelectionService } from '../services/selection.service';

@Component({
    selector: 'course-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class CourseListComponent {

  @Input() courses : Course[];

  constructor(
    private selectService : SelectionService) { }

  public clickCourse(course : Course) {
    this.selectService.toggleCourse(course);
  }
}
