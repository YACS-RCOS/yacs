import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import {Subject, Subscription, Subscriber} from 'rxjs/Rx';

import { Section, Listing, Term } from 'yacs-api-client';
import { SidebarService } from './sidebar.service';
import { SelectedTermService } from './selected-term.service';

@Injectable()
export class SelectionService {

  private clickEvent = new Subject();

   constructor (
    public sidebarService: SidebarService,
    protected selectedTermService: SelectedTermService) {
    this.selectedTermService.subscribeToActiveTerm((term: Term) => {
      this.clear();
    })
  }

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
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    this.isSectionSelected(section) ? this.removeSection(section) : this.addSection(section);
    this.next('event'); //this should be changed
  }

  public addSection (section: Section) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    let store = this.getSelections() || {};
    store[section.listing.id] = store[section.listing.id] || [];
    if (store[section.listing.id].includes(section.id)) return false;
    store[section.listing.id].push(section.id);
    store[section.listing.id].sort();
    this.setItem('selections', JSON.stringify(store));

    this.sidebarService.addListing(section.listing);
    return true;
  }

  public removeSection (section: Section) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
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
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections();
      delete store[course.id];
      this.setItem('selections', JSON.stringify(store));
    } else {
      course.sections.forEach((s) => {
        this.addSection(s);
      });
    }
    this.next('event');
  }

   public removeListing(course: Listing) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections();
      delete store[course.id];
      this.setItem('selections', JSON.stringify(store));
    } 
    this.next('event');
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
