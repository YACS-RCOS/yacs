import { Component, OnInit } from '@angular/core';

// import { School } from '../models/school.model';
import { YacsService } from '../services/yacs.service';
import { School } from 'yacs-api-client'

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
    School.includes('subjects').all().then((schools) => {
      this.schools = schools.data;
      this.isLoaded = true;
    });
  }

  ngOnInit () : void {
    this.getSchools();
  }
}
