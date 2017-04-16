import { Component, OnInit } from '@angular/core';
import { Department } from './department/component';
import { YacsService } from '../services/yacs.service';

export class School {
    id: number;
    name: string;
    departments: Department[];
}

const SCHOOL_TEST_DATA: School[] = [
    {
        id:1,
        name:'Science',
        departments: [
            {
                id: 1,
                code: 'CSCI',
                name: 'Computer Science'
            },
            {
                id: 2,
                code: 'MATH',
                name: 'Mathematics'
            }
        ]
    }
];

@Component({
  selector: 'schools',
  templateUrl: './component.html',
  // styleUrls: []
})
export class SchoolListComponent implements OnInit {
  schools: School[];

  constructor (private yacsService: YacsService) {}

  getSchools () {
    this.yacsService
        .get('schools')
        .then((data) => this.schools = data['schools'] as School[]);
  }

  ngOnInit () : void {
    this.getSchools();
    console.log(this.schools)
  }
}
