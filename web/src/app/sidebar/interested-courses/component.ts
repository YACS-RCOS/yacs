import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
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

  @Input() showStatusText: boolean = false;

  constructor (
      public sidebarService : SidebarService,
      private conflictsService: ConflictsService) {
    this.subscription = this.sidebarService.subscribe(() => {
      this.getCourses();
    });
  }

  ngOnInit () {
    this.listingIds = new Set<string>();
    this.getCourses();
  }

  async getCourses (): Promise<void> {
    this.listingIds = this.sidebarService.getListingIds();

    // display interested courses on sidebar
    // display message to try selecting some if none
    if (this.listingIds.size > 0) {
      this.showStatusText = false;
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
      this.showStatusText = true;
    }
  }
}
