import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolViewComponent } from './component';
import { SchoolListModule } from '../school-list/module';
import { YacsService } from '../services/yacs.service';

@NgModule({
  imports: [
    CommonModule,
    SchoolListModule
  ],
  declarations: [
    SchoolViewComponent
  ],
  providers: [YacsService],
})
export class SchoolViewModule { }