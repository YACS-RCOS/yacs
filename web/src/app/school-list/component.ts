import { Component, Input } from '@angular/core';

import { School } from 'yacs-api-client';

@Component({
  selector: 'school-list',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolListComponent {
  @Input() schools: School[] = [];
}
