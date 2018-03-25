import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { YacsService } from '../services/yacs.service';
import { Course } from '../models/course.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'header-bar',
  templateUrl: './component.html',
  providers: [YacsService],
  styleUrls: ['component.scss']
})

export class HeaderComponent {

  courses: Course[] = [];

  constructor(
    private router: Router, 
    private config: NgbTypeaheadConfig,
    private yacsService: YacsService) 
  { 
    //autocompletion of the first result
    config.showHint = true;
  }

  search(term: string) {
    this.router.navigate(['/courses'],
      { queryParams: {
        search: term
      }});
  }

  searchAhead = (text: Observable<string>) =>
    text
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(term =>
        this.yacsService
          .get('courses', text)
          .then((data) => {
            this.courses = data['courses'] as Course[];
          }))
  }
