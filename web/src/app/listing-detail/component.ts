import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private conflictsService: ConflictsService,
    private yacsService : YacsService) { }


    async getCourseByID (id: number): Promise<void> {
      Listing.find(id).then((listing) => {
        this.listing = listing.data;
      });
    }

    async saveListing (): Promise<void> {
      console.log(this.listing);
      let success = this.listing.save();
      console.log(success);
    }

    goBack (): void {
      this.location.back();
    }

    ngOnInit (): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = +params['id'];
      });

      this.getCourseByID(this.id);
      //console.log(this.listing);
      // this.listing.description = "foo";
      // this.listing.save();
    }
  }
