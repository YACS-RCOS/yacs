import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Term, Course, Listing } from 'yacs-api-client';
import { YacsService } from '../services/yacs.service';
import { ConflictsService } from '../services/conflicts.service';

@Component({
  selector: 'listing-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ListingDetailComponent implements OnInit {
  listings: Listing[] = [];
  isLoaded: boolean = false;

  constructor (
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute,
    private conflictsService: ConflictsService) { }

  ngOnInit (): void {
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   this.getCourses(params);
    // });
  }
}
