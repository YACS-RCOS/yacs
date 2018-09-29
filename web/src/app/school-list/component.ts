import { Component, Input } from '@angular/core';

import { School } from '../models/school.model';

@Component({
  selector: 'school-list',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolListComponent {
  @Input() schools: School[] = [];
}
