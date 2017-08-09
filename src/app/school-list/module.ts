import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SchoolListComponent } from './component';
import { DepartmentComponent } from './department/component';
import { YacsService } from '../services/yacs.service';
import { ConflictsService } from '../services/conflicts.service';

@NgModule({
    declarations: [
      SchoolListComponent,
      DepartmentComponent
    ],
    imports: [
      CommonModule,
      RouterModule
    ],
    providers: [
      ConflictsService,
      YacsService
    ]
})
export class SchoolListModule {}

