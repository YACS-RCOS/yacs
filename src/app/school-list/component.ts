import { Component, Input } from '@angular/core';

import { School } from './school/school';

@Component({
  selector: 'school-list',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolListComponent {
  @Input() schools: School[] = [];
}
