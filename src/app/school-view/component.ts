import { Component, OnInit } from '@angular/core';

import { School } from '../school-list/school/school';
import { YacsService } from '../services/yacs.service';

@Component({
  selector: 'school-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolViewComponent implements OnInit {
  isLoaded : boolean = false;
  schools: School[] = [];

  constructor (private yacsService: YacsService) {}

  getSchools () {
    this.isLoaded = false;
    this.yacsService
        .get('schools', { show_departments: true })
        .then((data) => {
          this.schools = data['schools'] as School[];
          this.isLoaded = true;
        });
  }

  ngOnInit () : void {
    this.getSchools();
  }
}
