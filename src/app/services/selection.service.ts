import { Injectable } from '@angular/core';

import { Section } from '../course-list/section/section';
import { Course } from '../course-list/course/course';

@Injectable()
export class SelectionService {

  public addSection(section : Section) {
    let obj = JSON.parse(localStorage.getItem('selections')) || {};
    if (obj[section.course_id]) {
      let sectionIndex = obj[section.course_id].indexOf(section.id);
      if (sectionIndex == -1) {
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
      let sectionIndex = obj[section.course_id].indexOf(section.id);
      if (sectionIndex > -1) {
        obj[section.course_id].splice(sectionIndex, 1);
        if (obj[section.course_id].length == 0) {
          delete obj[section.course_id];
        }
      }
    }
    localStorage.setItem('selections', JSON.stringify(obj));
  }

  public isSectionSelected(section : Section) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[section.course_id] && store[section.course_id].indexOf(section.id) > -1;
  }

  public hasSelectedSelection(course : Course) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[course.id];
  }
}
