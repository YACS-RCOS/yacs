import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { YacsService } from '../../services/yacs.service';
import { SelectionService } from '../../services/selection.service';
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

  constructor (
      private yacsService : YacsService,
      public selectionService : SelectionService) {
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

    if (this.listingIds.size > 0) {
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
          this.isLoaded = true;
          console.log(this.listings);
        });
      // this.yacsService
      //   .get('courses', { id: Array.from(this.courseIds).join(','), show_sections: true, show_periods: true })
      //   .then((data) => {
      //     this.courses = data['courses'] as Course[];
      //   });
    }
  }
}
