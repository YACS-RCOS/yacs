import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';

import { SchoolListComponent } from './component';
import { DepartmentComponent } from './department/component';

@NgModule({
    declarations: [
        SchoolListComponent,
        DepartmentComponent
    ],
    imports: [
      CommonModule
    ],
    providers: [],
})
export class SchoolListModule {}

