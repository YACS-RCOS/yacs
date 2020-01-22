import { Component, Input } from '@angular/core';
import { Listing, Period } from 'yacs-api-client';
import { ScheduleViewComponent } from '../component';

@Component({
  selector: 'schedule-event',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  providers: [],
  host: {
    '[style.height]': `height`,
    '(mouseenter)': `hover = true`,
    '(mouseleave)': `hover = false`
  },
})

export class ScheduleEventComponent {
  @Input() period: Period;
  @Input() normalHeight: number;

  hover: boolean = false;

  public get height (): string {
    return this.hover ? 'auto' : this.normalHeight + 'px';
  }

  public secType (type: string) : string {
    if(type == "LEC"){
      return "Lecture"
    }
    else if(type == "STU"){
      return "Studio"
    }
    else if(type == "TES"){
      return "Test"
    }
    else if(type == "LAB"){
      return "Lab"
    }
    else if(type == "REC"){
      return "Recitation"
    }
    else{
      return type
    }
  }

  /*
  public toggleInf(period: Period){
    let temp: boolean = !(sessionStorage.getItem('showInfo') == "true");
    sessionStorage.setItem('showInfo', String(temp));
    console.log(period.type);
  }
  */
}
