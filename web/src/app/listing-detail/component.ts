import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Term, Course, Listing, Section } from 'yacs-api-client';
import { ConflictsService } from '../services/conflicts.service';

@Component({
  selector: 'listing-detail',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class ListingDetailComponent implements OnInit {
  id: number;
  listing: Listing;
  sections: Section[];

  constructor (
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private conflictsService: ConflictsService) { }


    async getListingByID (id: number): Promise<void> {
      Listing.includes('sections').find(id).then((listing) => {
        this.listing = listing.data;
        //this.sections = this.listing.sections;
        this.sections = [];
        console.log(this.sections);
      });
    }

    async saveListing (): Promise<void> {
      this.listing.save();
      this.goBack();
    }

    goBack (): void {
      this.location.back();
    }

    ngOnInit (): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
      });

      this.getListingByID(this.id);
    }
  }
