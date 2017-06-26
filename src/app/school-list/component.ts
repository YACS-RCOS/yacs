import { Component, OnInit } from '@angular/core';
import { Department } from './department/component';
import { YacsService } from '../services/yacs.service';

export class School {
    id: number;
    name: string;
    departments: Department[];
}

@Component({
  selector: 'schools',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolListComponent implements OnInit {
  schools: School[];

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
