import { Injectable } from '@angular/core';

/* Constants go here. */
const DAY_NAMES: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Injectable()
export class ConstantsService {
  public longDayName(dayIndex): string {
    return DAY_NAMES[dayIndex];
  }
  public shortDayName(dayIndex): string {
    return DAY_NAMES[dayIndex].substring(0,3);
  }
}
