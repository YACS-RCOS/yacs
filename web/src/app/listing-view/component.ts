import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Term, Course, Listing } from 'yacs-api-client';
import { YacsService } from '../services/yacs.service';
import { ConflictsService } from '../services/conflicts.service';

@Component({
  selector: 'listing-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ListingViewComponent implements OnInit {
  listings: Listing[] = [];
  isLoaded: boolean = false;

  constructor (
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute,
    private conflictsService: ConflictsService) { }

  async getCourses (params: Params): Promise<void> {
    this.isLoaded = false;
    const term = await Term.first();
    Listing
      .where({ term_id: term.data.id, subject_id: params.subject_id } )
      .includes('sections')
      .includes('sections.listing')
      .includes('course')
      .includes('course.subject')
      .order('course_shortname')
      .all().then((listings) => {
        this.listings = listings.data;
        this.conflictsService.populateConflictsCache(this.listings);
        this.isLoaded = true;
      });
  }

  ngOnInit (): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.getCourses(params);
    });
  }
}
