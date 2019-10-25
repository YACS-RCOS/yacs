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
        this.sections = this.listing.sections;
      });
    }

    async saveListing (): Promise<void> {
      // this.listing.save({with: 'sections'});
      this.listing.save();
      this.goBack();
    }

    goBack (): void {
      this.location.back();
    }

    inputStringToArray (event, index): void {
      this.listing.sections[index].instructors = event.split();
    }

    addSection (): void {
      this.listing.sections.push(new Section());
    }

    deleteSection (section: Section): void {
      const index: number = this.listing.sections.indexOf(section);
      if (index !== -1) {
          this.listing.sections.splice(index, 1);
      }
    }

    ngOnInit (): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
      });

      this.getListingByID(this.id);
    }
  }
