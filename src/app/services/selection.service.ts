import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie';

import { Section } from '../course-list/section/section';

@Injectable()
export class SelectionService {

  constructor(
    private cookieService : CookieService) { }

  public addSection(section : Section) {
    let obj = this.cookieService.get('selections') || {};
    console.log('before add', obj);
    this.cookieService.remove('selections');
    if (obj[section.course_id]) {
      let sectionIndex = obj[section.course_id].indexOf(section.id);
      if (sectionIndex == -1) {
        obj[section.course_id].push(section.id);
        obj[section.course_id].sort();
      }
    } else {
      obj[section.course_id] = [section.id];
    }
    console.log('add', obj);
    this.cookieService.put('selections', JSON.stringify(obj));
  }

  public removeSection(section : Section) {
    let obj = this.cookieService.get('selections') || {};
    console.log('before remove', obj);
    this.cookieService.remove('selections');
    if (obj[section.course_id]) {
      let sectionIndex = obj[section.course_id].indexOf(section.id);
      if (sectionIndex > -1) {
        obj[section.course_id].split(sectionIndex, 1);
      }
    }
    console.log('remove', obj);
    this.cookieService.put('selections', JSON.stringify(obj));
  }

  public isSelected(section : Section) : boolean {
    console.log((this.cookieService.get('selections') && this.cookieService.get('selections')[section.course_number]) ? this.cookieService.get('selections')[section.course_number].indexOf(section.id) : 'no');
    return this.cookieService.get('selections') && this.cookieService.get('selections')[section.course_number] && this.cookieService.get('selections')[section.course_number].indexOf(section.id) > -1;
  }
}
