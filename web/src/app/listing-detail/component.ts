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
  constructor (
    private yacsService : YacsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private conflictsService: ConflictsService) { }

  ngOnInit (): void {
    let id: number;

    this.activatedRoute.params.subscribe((params: Params) => {
      id = +params['id'];
     });
  }
}
