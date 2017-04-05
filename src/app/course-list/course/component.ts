import { Component, Input } from '@angular/core';
import { Section } from '../section/component';

export class Course {
  id: number;
  name: string;
  num: string;
  departmentCode: string;
  minCredits:number;
  maxCredits:number;
  description: string;
  sections: Section[];
}

@Component({
  selector: 'course',
  templateUrl: './component.html',
})
export class CourseComponent {
  @Input() course: Course;

  /* A getter function for the range of credits based on the min and max.
   * When {{creditRange}} is used in the template, this function will be called. */
  public get creditRange() {
    let minCredits = this.course.minCredits;
    let maxCredits = this.course.minCredits;
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
