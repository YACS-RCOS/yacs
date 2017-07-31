import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';

import { ScheduleViewComponent } from './component';
import { ScheduleComponent } from './schedule/component';
//import { YacsService } from '../services/yacs.service';

@NgModule({
  declarations: [
    ScheduleViewComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    //RouterModule
  ],
  providers: [],
  //providers: [YacsService],
})

export class ScheduleViewModule {}
