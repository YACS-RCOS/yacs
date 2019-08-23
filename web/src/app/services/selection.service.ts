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
      this.clear(true);
    })
  }

  subscribe (next): Subscription {
    return this.clickEvent.subscribe(next);
  }

  next (event) {
    this.clickEvent.next(event);
  }

  private setItem (data1:string, data2, mode:boolean) {
    if (mode) { localStorage.setItem(data1, data2); }
    else { sessionStorage.setItem(data1, data2); }
  }

  private getItem (data:string, mode:boolean) {
    if (mode) { return localStorage.getItem(data); }
    else { return sessionStorage.getItem(data); }
  }

  public toggleSection (section : Section, mode:boolean) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    this.isSectionSelected(section) ? this.removeSection(section, mode) : this.addSection(section, mode);
    this.next('event'); //this should be changed
  }

  public addSection (section: Section, mode:boolean) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    let store = this.getSelections(mode) || {};
    store[section.listing.id] = store[section.listing.id] || [];
    if (store[section.listing.id].includes(section.id)) return false;
    store[section.listing.id].push(section.id);
    store[section.listing.id].sort();
    this.setItem('selections', JSON.stringify(store), mode);

    if (mode) this.sidebarService.addListing(section.listing);
    return true;
  }

  public removeSection (section: Section, mode:boolean) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    let store = this.getSelections(mode) || {};
    if (!store[section.listing.id] || !store[section.listing.id].includes(section.id)) return false;
    store[section.listing.id].splice(store[section.listing.id].indexOf(section.id), 1);
    if (store[section.listing.id].length == 0) {
      delete store[section.listing.id];
    }
    this.setItem('selections', JSON.stringify(store), mode);
    return true;
  }

  public toggleCourse(course: Listing, mode:boolean) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections(mode);
      delete store[course.id];
      this.setItem('selections', JSON.stringify(store), mode);
    } else {
      course.sections.forEach((s) => {
        this.addSection(s, mode);
      });
    }
    this.next('event');
  }

   public removeListing(course: Listing) {
    if (!this.selectedTermService.isCurrentTermActive) { return; }
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections(true);
      delete store[course.id];
      this.setItem('selections', JSON.stringify(store), true);
    } 
    this.next('event');
  }


  public isSectionSelected (section: Section) : boolean {
    let store = this.getSelections(true);
    return store && store[section.listing.id] && store[section.listing.id].includes(section.id);
  }

  public hasSelectedSection (course: Listing) : boolean {
    let store = this.getSelections(true);
    return store && store[course.id] && store[course.id].length > 0;
  }

  public getSelections (mode:boolean) {
    return JSON.parse(this.getItem('selections', mode)) || {};
  }

  public getSelectedSectionIds (mode:boolean) {
    const selections = this.getSelections(mode);
    const sectionIds = [];
    Object.keys(selections).forEach((key) => {
      sectionIds.push(...selections[key]);
    });localStorage
    return sectionIds;
  }

  public getSelectedCourseIds (mode:boolean) {
    return Object.keys(this.getSelections(mode));
  }

  public clear (mode:boolean) {
    let store = {};
    this.setItem('selections', JSON.stringify(store), mode);
    this.next('event');
  }
}
