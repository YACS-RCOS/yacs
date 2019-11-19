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

    constructPeriodsArray(periods: Period[]): any[][] {
      const periodsByDay = [Array(5)];
      periods.forEach(period => {
        if (period.day >= 1 && period.day <= 5) {
          if (periodsByDay.slice(-1)[0][period.day-1]) {
            periodsByDay.push(Array(5));
          }
          periodsByDay.slice(-1)[0][period.day-1] = period;
        }
      });
      console.log(periodsByDay);
      return periodsByDay;
    }

    private timeToString(time: number) : string {
      let hour = Math.floor(time / 100);
      let minute = Math.floor(time % 100);

      let ampm = 'a';
      if (hour >= 12) {
        ampm = 'p';
        if (hour > 12) {
          hour -= 12;
        }
      }

      let minuteShow = '';
      if (minute != 0) {
        minuteShow = ':' + (minute < 10 ? '0' : '') + minute;
      }

      return hour + minuteShow + ampm;
    }

    getHours (period: any) : string {
      return this.timeToString(period.start) + '-' + this.timeToString(period.end);
    }
  }
