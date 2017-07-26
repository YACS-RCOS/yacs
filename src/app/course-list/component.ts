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
    if (this.selectService.hasSelectedSelection(course)) {
      course.sections.forEach((s) => {
        this.selectService.removeSection(s);
      });
    } else {
      course.sections.forEach((s) => {
        if (s.seats_taken < s.seats) {
          this.selectService.addSection(s);
        }
      });
    }
  }
}
