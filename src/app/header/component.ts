import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { YacsService } from '../services/yacs.service';
import { Course } from '../models/course.model';
import 'rxjs/add/operator/switchMap';
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
  termID: number;

  constructor(
    private router: Router, 
    private yacsService: YacsService) {}

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
          .get('courses', { search: term })
          .then(data => {
            if (term.length > 2) {
              this.courses = (data['courses'] as Course[]);
              return this.courses.map(c => c.name).slice(0, 10);
            }
          }))

  selectedCourse(term: string) {
    this.yacsService.get('courses', term).then(data => {
      this.courses = (data['courses'] as Course[]);
      this.termID = this.courses.map(c => c.id)[0];
    })
    this.router.navigate(['\courses?id=' + this.termID]);
  }
}