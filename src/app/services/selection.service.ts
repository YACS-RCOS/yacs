import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie';

import { Section } from '../course-list/section/section';

@Injectable()
export class SelectionService {

  constructor(
    private cookieService : CookieService) { }

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
      }
    }
    localStorage.setItem('selections', JSON.stringify(obj));
  }

  public isSelected(section : Section) : boolean {
    let store = JSON.parse(localStorage.getItem('selections'));
    return store && store[section.course_id] && store[section.course_id].indexOf(section.id) > -1;
  }
}
