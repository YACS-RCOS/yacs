import { Component, OnInit } from '@angular/core';
import { YacsService } from '../services/yacs.service';

import { School } from './school';

@Component({
  selector: 'schools',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolListComponent implements OnInit {
  schools: School[] = [];

  constructor (private yacsService: YacsService) {}

  getSchools () {
    this.yacsService
        .get('schools', { show_departments: true })
        .then((data) => {
          this.schools = data['schools'] as School[];
        });
  }

  ngOnInit () : void {
    this.getSchools();
  }
}
