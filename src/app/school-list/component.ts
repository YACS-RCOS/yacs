import { Component } from '@angular/core';
import { Department } from './department/component';

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
export class SchoolListComponent {
    schools = SCHOOL_TEST_DATA;
}

