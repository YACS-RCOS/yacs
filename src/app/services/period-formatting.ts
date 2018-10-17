import { Injectable } from '@angular/core';
import { Period } from '../models/period.model';

@Injectable()
export class TimeConversionService {
  /**
   * Convert minutes-since-start-of-week number to an ordinary time.
   * 600 = 10a
   * 610 = 10:10a
   * 720 = 12p
   */
  public timeToString(time: number) : string {
    let hour = Math.floor(time / 100);
    let minute = Math.floor(time % 100);

    let ampm = 'a';
    if (hour >= 12) {
      ampm = 'p';
      if (hour > 12) {
        hour -= 12;
      }
    }

    let minuteShow = '';
    if (minute != 0) {
      minuteShow = ':' + (minute < 10 ? '0' : '') + minute;
    }
    else {
      minuteShow = ':00';
    }
    return hour + minuteShow + ampm;
  	}
  }