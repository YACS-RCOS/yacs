import { Component, Input, OnInit } from '@angular/core';
import { Listing, Section } from 'yacs-api-client';
import { ScheduleEvent } from '../models/schedule-event.model';
import { SelectionService } from '../services/selection.service';
import { ConflictsService } from '../services/conflicts.service';
import { SidebarService } from '../services/sidebar.service';

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
  @Input() showRemoveButton: boolean = false;


  constructor (
    public selectionService : SelectionService,
    public sidebarService : SidebarService,
    private conflictsService: ConflictsService) { }


  public showingMenu;
  public showingDescription;
  public hovered;

  public mouseMove: boolean = false;
  public mouseDown: boolean = false; 

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
    // TODO: We shouldn't need to check this here and in the section component
    return this.conflictsService.doesConflict(section);
  }

  public mouseDownFunc (): void { 
    this.mouseDown = true;
  }

  public mouseMoveFunc (): void { 
    if (this.mouseDown) {
      this.mouseMove = true;
    }
  }

  public descriptionClick (event): void { 
    event.stopPropagation();
    if (this.mouseMove) {
      this.selectionService.toggleCourse(this.listing);
    } 
    
    this.mouseMove = false;
    this.mouseDown = false;
  }

  public get tooltipDescription (): string {
    return this.listing.description || 'No description available :(';
  }

  public getSectionClosedCount (): number {
    let closedCount = 0;
    this.listing.sections.forEach((s) => {
      if (s.seatsTaken >= s.seats) {
        closedCount += 1;
      }
    });
    return closedCount;

  }

  public getSectionConflictCount (): number {
    let conflictCount = 0;
    this.listing.sections.forEach((s) => {
      if (this.doesConflict(s)) {
        conflictCount += 1;
      }
    });
    return conflictCount;

  }

  public removeButtonClick (): void {
    this.sidebarService.removeListing(this.listing);
    this.selectionService.removeListing(this.listing);
  }

  public expandDescripAndListings (): void {
    this.showingDescription = !this.showingDescription;
    this.showingMenu = !this.showingMenu;
  }
  
}
