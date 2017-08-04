export class SchedulePeriod {
  name: string; // e.g. "MATH 1010 - 01"
  crn: number;
  instructor: string;
  day: number;

  // these are minutes since midnight
  startTime: number;
  endTime: number;
}