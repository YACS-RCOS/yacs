import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Term, Course, Listing } from 'yacs-api-client';
import { YacsService } from '../services/yacs.service';
import { ConflictsService } from '../services/conflicts.service';
import { SelectedTermService } from '../services/selected-term.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'listing-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ListingViewComponent implements OnInit, OnDestroy {
  listings: Listing[] = [];
  isLoaded: boolean = false;
  cachedTerm: string;
  cachedQuery: Params;
  termSubscription: Subscription;

  constructor (
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute,
    private conflictsService: ConflictsService,
    private selectedTermService: SelectedTermService) {
    this.cachedTerm = this.selectedTermService.currentTermId;
  }

  async getCourses (params: Params, term: string): Promise<void> {
    this.isLoaded = false;
    const query = Object.assign({ term_id: term }, params);
    Listing
      .where(query)
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
      this.cachedQuery = params;
      // only operate if the selected term has been determined (prevents race condition)
      if (this.cachedTerm !== undefined) {
        this.getCourses(this.cachedQuery, this.cachedTerm);
      }
    });
    this.termSubscription = this.selectedTermService.subscribeToTerm((term: Term) => {
      this.cachedTerm = term.id;
      // only operate if the query has been determined (prevents race condition)
      if (this.cachedQuery !== undefined) {
        this.getCourses(this.cachedQuery, this.cachedTerm);
      }
    });

  }

  ngOnDestroy(): void {
    // unsubscribe from the term subscription when this listing is destroyed to prevent leaking
    this.termSubscription.unsubscribe();
  }
}
