import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course-list/course/component';


@Component({
    selector: 'course-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class CourseListComponent implements OnInit {

  @Input() courses : Course[];

  constructor () {}

  ngOnInit () : void {
    
  }
}
