import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Listing } from 'yacs-api-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import qs from 'qs';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'header-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss']
})

export class HeaderComponent {

  //flag to stop keyup.enter from doing normal search when drop down is used
  dropDownSelected: boolean = false;
  navbarCollapsed: boolean = true;

  constructor (private router: Router, private http: HttpClient) { }

  //keyup.enter generic search
  search (term: string) {
    if (this.isValidSearchTerm(term) && !this.dropDownSelected) {
      //Sends the info about the user's search to the user system backend
      this.http.post('https://api.yacs.maoyu.wang/userEvent', {
        "uid": sessionStorage.getItem('userID'),
        "eventID": "3",
        "data": {
            'Search' : term

        },
        "createdAt": Date.now()
      }).subscribe(
        data => {console.log(data)},
        err => {console.log(err)}
      );
      this.router.navigate(['/courses'], { queryParams: { search: term } });
    }
    this.dropDownSelected = false;
  }

  //list of typeahead courses
  searchAhead = (text: Observable<string>) =>
    text
      .debounceTime(200)
      .distinctUntilChanged()
      .filter(this.isValidSearchTerm)
      .switchMap(term =>
        Listing
          .where({ search: term })
          .select({ listings: ['longname'] })
          .all().then(listings => {
            const listingLongnames = listings.data.map(listing => listing.longname);
            return listingLongnames
              .filter((listingLongname, i) => { // remove duplicates
                return listingLongnames.indexOf(listingLongname) == i;
              })
              .slice(0, 10); //only return top 10
          }))

  //function for on-click typeahead bar
  selectedCourse ($event: any) {
    this.http.post('https://api.yacs.maoyu.wang/userEvent', {
      "uid": sessionStorage.getItem('userID'),
      "eventID": "3",
      "data": {
          'Search' : $event.item
      },
      "createdAt": Date.now()
    }).subscribe(
      data => {console.log(data)},
      err => {console.log(err)}
    );
  
    this.router.navigate(['/courses'],
      { queryParams: {
        longname: $event.item
      }});
    this.dropDownSelected = true;
  }

  private isValidSearchTerm (term: string) {
    return (term.length > 1 && /\S/.test(term));
  }
}
