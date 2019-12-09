import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Term, Course, Listing, Section, Period } from 'yacs-api-client';
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
    private conflictsService: ConflictsService) { }

    async getListingByID (id: number): Promise<void> {
      Listing.includes('sections').find(id).then((listing) => {
        this.listing = listing.data;
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

    ngOnInit (): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.id = params['id'];
      });

      this.getListingByID(this.id);
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

    addPeriod (section: Section, day: number): void {
      let period = new Period();
      period.day = day;
      period.start = "1200";
      period.end = "1350";
      period.type = "LEC";
      section.periods.push(period);
    }

    inputStringToArray (event, index): void {
      this.listing.sections[index].instructors = event.split();
    }

    constructPeriodsArrayByDay(periods: Period[]): Period[][] {
      var periodsByDay: Period[][] = new Array<Array<Period>>(5);
      var mode = this.mode(periods.map(x => x.day));
      var depth = 0;
      for(var i = 0; i < periods.length; ++i){
          if(periods[i].day == mode) {
              depth++;
          }
      }

      for (let i = 0; i < 5; i++) {
        periodsByDay[i] = new Array<Period>();
      }

      periods.forEach(period => {
        periodsByDay[period.day-1].push(period);
      });

      return this.transposeArray(periodsByDay, depth);
    }

    private transposeArray(array, arrayLength){
        var newArray = [];
        for(var i = 0; i < array.length; i++){
            newArray.push([]);
        };

        for(var i = 0; i < array.length; i++){
            for(var j = 0; j < arrayLength; j++){
                newArray[j].push(array[i][j]);
            };
        };

        return newArray;
    }

    private mode(array: any[]): any {
        if(array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
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
