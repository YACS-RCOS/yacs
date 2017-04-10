import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';

import { ScheduleViewComponent } from './component';
import { ScheduleComponent } from './schedule/component';

@NgModule({
  declarations: [
    ScheduleViewComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [],
})

export class ScheduleViewModule {}
