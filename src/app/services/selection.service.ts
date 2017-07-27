import { Injectable } from '@angular/core';

import { Section } from '../course-list/section/section';
import { Course } from '../course-list/course/course';

@Injectable()
export class SelectionService {

  public toggleSection(section : Section) {
    this.isSectionSelected(section) ? this.removeSection(section) : this.addSection(section);
  }

  public addSection(section : Section) {
    let store = JSON.parse(localStorage.getItem('selections')) || {};
    store[section.course_id] = store[section.course_id] || [];
    if (!store[section.course_id].includes(section.id)) {
      store[section.course_id].push(section.id);
      store[section.course_id].sort();
    }
    localStorage.setItem('selections', JSON.stringify(store));
  }

  public removeSection(section : Section) {
    let store = JSON.parse(localStorage.getItem('selections')) || {};
    if ((store[section.course_id] || []).includes(section.id)) {
      store[section.course_id].splice(store[section.course_id].indexOf(section.id), 1);
      if (store[section.course_id].length == 0) {
        delete store[section.course_id];
      }
    }
    localStorage.setItem('selections', JSON.stringify(store));
  }

  public toggleCourse(course : Course) {
    if (this.hasSelectedSection(course)) {
      let store = JSON.parse(localStorage.getItem('selections'));
      delete store[course.id];
      localStorage.setItem('selections', JSON.stringify(store));
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

  public hasSelectedSection(course : Course) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[course.id] && store[course.id].length > 0;
  }
}
