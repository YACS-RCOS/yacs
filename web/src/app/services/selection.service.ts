import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import {Subject,Subscription, Subscriber} from 'rxjs/Rx';

import { Section } from 'yacs-api-client';
import { Listing } from 'yacs-api-client';

@Injectable()
export class SelectionService {

  private clickEvent = new Subject();

  subscribe (next): Subscription {
    return this.clickEvent.subscribe(next);
  }

  next (event) {
    this.clickEvent.next(event);
  }

  private setItem (data1:string, data2) {
    localStorage.setItem(data1, data2);
  }

  private getItem (data:string) {
    return localStorage.getItem(data);
  }

  public toggleSection (section : Section) {

    this.isSectionSelected(section) ? this.removeSection(section) : this.addSection(section);
    this.next('event'); //this should be changed
  }

  public addSection (section: Section) {
    let store = this.getSelections() || {};
    store[section.listing.id] = store[section.listing.id] || [];
    if (store[section.listing.id].includes(section.id)) return false;
    store[section.listing.id].push(section.id);
    store[section.listing.id].sort();
    this.setItem('selections', JSON.stringify(store));
    return true;
  }

  public removeSection (section: Section) {
    let store = this.getSelections() || {};
    if (!store[section.listing.id] || !store[section.listing.id].includes(section.id)) return false;
    store[section.listing.id].splice(store[section.listing.id].indexOf(section.id), 1);
    if (store[section.listing.id].length == 0) {
      delete store[section.listing.id];
    }
    this.setItem('selections', JSON.stringify(store));
    return true;
  }

  public toggleCourse(course: Listing) {
    let closedCount = -1;
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections();
      delete store[course.id];
      this.setItem('selections', JSON.stringify(store));
    } else {
      closedCount = 0;
      course.sections.forEach((s) => {
        if (s.seatsTaken >= s.seats) {
          closedCount += 1;
        }
        this.addSection(s);
      });
    }
    this.next('event');
    return closedCount;
  }

  public isSectionSelected (section: Section) : boolean {
    let store = this.getSelections();
    return store && store[section.listing.id] && store[section.listing.id].includes(section.id);
  }

  public hasSelectedSection (course: Listing) : boolean {
    let store = this.getSelections();
    return store && store[course.id] && store[course.id].length > 0;
  }

  public getSelections () {
    return JSON.parse(this.getItem('selections')) || {};
  }

  public getSelectedSectionIds () {
    const selections = this.getSelections();
    const sectionIds = [];
    Object.keys(selections).forEach((key) => {
      sectionIds.push(...selections[key]);
    });
    return sectionIds;
  }

  public getSelectedCourseIds () {
    return Object.keys(this.getSelections());
  }

  public clear () {
    let store = {};
    this.setItem('selections', JSON.stringify(store));
    this.next('event');
  }
}
