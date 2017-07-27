import { Injectable } from '@angular/core';

import { Section } from '../course-list/section/section';
import { Course } from '../course-list/course/course';

@Injectable()
export class SelectionService {

  public toggleSection(section : Section) {
    this.isSectionSelected(section) ? this.removeSection(section) : this.addSection(section);
  }

  public addSection(section : Section) {
    let obj = JSON.parse(localStorage.getItem('selections')) || {};
    if (obj[section.course_id]) {
      if (!obj[section.course_id].includes(section.id)) {
        obj[section.course_id].push(section.id);
        obj[section.course_id].sort();
      }
    } else {
      obj[section.course_id] = [section.id];
    }
    localStorage.setItem('selections', JSON.stringify(obj));
  }

  public removeSection(section : Section) {
    let obj = JSON.parse(localStorage.getItem('selections')) || {};
    if (obj[section.course_id]) {
      if (obj[section.course_id].includes(section.id)) {
        obj[section.course_id].splice(obj[section.course_id].indexOf(section.id), 1);
        if (obj[section.course_id].length == 0) {
          delete obj[section.course_id];
        }
      }
    }
    localStorage.setItem('selections', JSON.stringify(obj));
  }

  public toggleCourse(course : Course) {
    if (this.hasSelectedSelection(course)) {
      delete JSON.parse(localStorage.getItem('selections'))[course.id];
    } else {
      course.sections.forEach((s) => {
        if (s.seats_taken < s.seats) {
          this.addSection(s);
        }
      });
    }
  }

  public isSectionSelected(section : Section) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[section.course_id] && store[section.course_id].includes(section.id);
  }

  public hasSelectedSelection(course : Course) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[course.id];
  }
}
