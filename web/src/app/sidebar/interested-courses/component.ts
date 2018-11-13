import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionService } from '../../services/selection.service';
import { ConflictsService } from '../../services/conflicts.service';
// import { Course } from '../../models/course.model';
import { Term, Listing } from 'yacs-api-client';
import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';

@Component({
  selector: 'interested-courses',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class InterestedCoursesComponent implements OnInit {

  listings: Listing[] = [];
  isLoaded: boolean = false;
  private listingIds: Set<string>;
  private subscription;

  statusText: string = '';

  constructor (
      public selectionService : SelectionService,
      private conflictsService: ConflictsService) {
    this.subscription = this.selectionService.subscribe(() => {
      this.getCourses();
    });
  }

  ngOnInit () {
    this.listingIds = new Set<string>();
    this.getCourses();
  }

  async getCourses (): Promise<void> {
    this.selectionService.getSelectedCourseIds().forEach(this.listingIds.add, this.listingIds);

    // display interested courses on sidebar
    // display message to try selecting some if none
    if (this.listingIds.size > 0) {
      this.statusText = '';
      this.isLoaded = false;
      const term = await Term.first();
      Listing
        .where({ id: Array.from(this.listingIds) })
        .includes('sections')
        .includes('sections.listing')
        .includes('course')
        .includes('course.subject')
        .all().then((listings) => {
          this.listings = listings.data;
          this.conflictsService.populateConflictsCache(this.listings);
          this.isLoaded = true;
        });
    } else {
      this.statusText = 'Try selecting some courses :)';
    }
  }
}
