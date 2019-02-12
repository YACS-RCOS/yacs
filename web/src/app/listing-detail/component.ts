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
  id: number;
  listing: Listing;

  constructor (
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private conflictsService: ConflictsService) { }


    async getCourseByID (id: number): Promise<void> {
      Listing.find(id).then((listing) => {
        this.listing = listing.data;
      });
    }

    saveListing (): void {
      // TODO
    }

    goBack (): void {
      //TODO
    }

    ngOnInit (): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = +params['id'];
      });

      this.getCourseByID(this.id);
    }
  }
