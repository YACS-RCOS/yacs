import { Component, Input } from '@angular/core';
import { Course } from './course';

@Component({
  selector: 'course',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class CourseComponent {
  @Input() course: Course;

  /* A getter function for the range of credits based on the min and max.
   * When {{creditRange}} is used in the template, this function will be called. */
  public get creditRange() {
    let minCredits = this.course.min_credits;
    let maxCredits = this.course.max_credits;
    let outstr = '';
    let plural = true;
    if(minCredits !== maxCredits) {
      outstr = minCredits + '-' + maxCredits + ' credits';
    } else {
      outstr = maxCredits + ' credit';
      if(maxCredits !== 1) {
        outstr += 's';
      }
    }
    return outstr;
  }
}
