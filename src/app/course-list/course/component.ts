import { Component, Input } from '@angular/core';
import { Course } from './course';
import { Section } from '../section/section';
import { SelectionService } from '../../services/selection.service'

@Component({
  selector: 'course',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class CourseComponent {
  @Input() course: Course;

  constructor(
    private selectService : SelectionService) { }
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

  public isSelected(section : Section) : boolean {
    return this.selectService.isSectionSelected(section);
  }

  public clickSection(section : Section) {
    this.isSelected(section) ? this.selectService.removeSection(section) : this.selectService.addSection(section);
  }
}
