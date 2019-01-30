import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleViewComponent } from './component';
import { ScheduleComponent } from './schedule/component';
import { ScheduleEventComponent } from './schedule-event/component';
import { ColorService } from '../services/color.service';

@NgModule({
  declarations: [
    ScheduleViewComponent,
    ScheduleComponent,
    ScheduleEventComponent,
  ],
  imports: [
    NgbModule,
    CommonModule
  ],
  providers: [
    ColorService
  ]
})

export class ScheduleViewModule {}
