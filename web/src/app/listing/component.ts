import { Component, Input, OnInit } from '@angular/core';
// import { Course } from '../models/course.model';
import { Listing } from 'yacs-api-client';
import { Section } from 'yacs-api-client';
import { ScheduleEvent } from '../models/schedule-event.model';
import { Schedule } from '../models/schedule.model';
import { SelectionService } from '../services/selection.service'
import { ConflictsService } from '../services/conflicts.service'

@Component({
  selector: 'course',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  host: { '[class.selected]': 'isCourseSelected()' }
})
export class ListingComponent implements OnInit{
  @Input() listing: Listing;
  @Input() showDescriptionTooltip: boolean = false;
  @Input() showDescription: boolean = false;

  constructor (
    public selectionService : SelectionService,
    private conflictsService: ConflictsService) { }

  public showingMenu;
  public showingDescription;
  public hovered;
  
  ngOnInit () {
    this.showingMenu = false;
    this.showingDescription = false;
  }

  public get creditRange () {
    const minCredits = this.listing.minCredits;
    const maxCredits = this.listing.maxCredits;
    let outstr = '';
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

  public clickCourse () {
    this.selectionService.toggleCourse(this.listing);
  }

  public isCourseSelected () {
    return this.selectionService.hasSelectedSection(this.listing);
  }

  public isSectionSelected (section: Section): boolean {
    return this.selectionService.isSectionSelected(section);
  }

  public clickSection (section: Section): void {
    this.selectionService.toggleSection(section);
  }

  public doesConflict (section: Section): boolean {
    return this.conflictsService.doesConflict(parseInt(section.id));
  }

  public descriptionClick (): void {
    // this.selectionService.toggleCourse(this.listing);
    this.showingDescription= !(this.showingDescription);
  }

  public get tooltipDescription (): string {
    return this.listing.description || 'No description available :('; 
  }
}
