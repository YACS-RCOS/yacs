export class Day {
	private static readonly DAY_LONGNAMES: string[] = 
		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	private static readonly DAY_SHORTNAMES: string[] =
		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor (public readonly num: number) { }

  public get longname (): string {
  	return Day.DAY_LONGNAMES[this.num];
  }

  public get shortname (): string {
  	return Day.DAY_SHORTNAMES[this.num];
  }
}
