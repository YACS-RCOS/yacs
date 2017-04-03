import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';

import { SchoolsComponent } from './schools.component';
import { DepartmentComponent } from './department.component';

@NgModule({
    declarations: [
        SchoolsComponent,
        DepartmentComponent
    ],
    imports: [
      CommonModule
    ],
    providers: [],
})
export class SchoolsModule {}

