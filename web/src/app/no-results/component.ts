import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'no-results',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class NoResultsComponent implements OnInit, OnDestroy {
  search: string;
  fromSearch: boolean;
  private sub: any;

  constructor (private route: ActivatedRoute) {}

	ngOnInit () {
    this.sub = this.route.params.subscribe(params => {
      this.search = params['search'] ? params['search'] : "";
      this.fromSearch = this.search.length > 0;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}