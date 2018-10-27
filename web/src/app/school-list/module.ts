import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SchoolListComponent } from './component';
import { SchoolComponent } from './school/component';
import { DepartmentComponent } from './department/component';

import { YacsService } from '../services/yacs.service';
import { ConflictsService } from '../services/conflicts.service';

@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SchoolListComponent
  ],
  providers: [
    ConflictsService,
    YacsService
  ]
})
export class SchoolListModule { }
