import { Schedule, Section, Period } from 'yacs-api-client';

export class ScheduleSet {
	public readonly startDay: number = 1;
	public readonly endDay: number = 5;
	public readonly startTime: number = 480;
	public readonly endTime: number = 1320;

	private scheduleIndex: number = 0;

	public constructor (
		public readonly schedules: Schedule[],
		public readonly height: number
	) { }

	public get numDays (): number {
		return (this.endDay - this.startDay) + 1;
	}

	public get numMinutes (): number {
		return (this.endTime - this.startTime);
	}

	public get activeSchedule (): Schedule {
		return this.schedules[this.scheduleIndex];
	}

	public get activeScheduleIndex (): number {
		return this.scheduleIndex;
	}

	public get numSchedules (): number {
		return this.schedules.length;
	}

	public get activeSections (): Section[] {
		if (this.numSchedules == 0) {
			return [];
		}
		return this.activeSchedule.sections;
	}

	public get activePeriods (): Period[] {
		return [].concat(...this.activeSections.map(s => s.periods));
	}

  public decrementActiveSchedule (): void {
    if (this.scheduleIndex > 0) {
      --this.scheduleIndex;
    } else {
      this.scheduleIndex = this.schedules.length - 1;
    }
  }

  public incrementActiveSchedule (): void {
    if (this.scheduleIndex < this.schedules.length - 1) {
      ++this.scheduleIndex;
    } else {
      this.scheduleIndex = 0;
    }
  }
}
