import { Injectable } from '@angular/core';

export class ColorAssignment {
	constructor (
		public readonly primary: string,
		public readonly text: string,
		public readonly border: string
	) { }
}

@Injectable()
export class ColorService {
	private static readonly COLORS: string[] = ['#ffd4df', '#ceeffc', '#fff4d0', '#dcf7da', '#f7e2f7', '#ede6df', '#ffe9cf'];
  private static readonly TEXT_COLORS: string[] = ['#d1265d', '#1577aa', '#bf8a2e', '#008a2e', '#853d80', '#9d5733', '#d9652b'];
  private static readonly BORDER_COLORS: string[] = ['#ff2066', '#00aff2', '#ffcb45', '#48da58', '#d373da', '#a48363', '#ff9332'];
  private static readonly NUM_COLORS = 7;

  // TODO: use something persistent
  private assignmentIncr: number = 0;
  private colorAssignments: Map<string, number> = new Map();

  public getColor (id: string): ColorAssignment {
  	const assignment: number = this.assign(id);
  	return new ColorAssignment(
  		ColorService.COLORS[assignment],
  		ColorService.TEXT_COLORS[assignment],
  		ColorService.BORDER_COLORS[assignment]
  	);
  }

  private assign (id: string): number {
  	if (this.colorAssignments.has(id))
  		return this.colorAssignments.get(id);
  	else
  		return this.colorAssignments.set(id, this.nextAssignment()).get(id);
  }

  private nextAssignment (): number {
  	return (++this.assignmentIncr) % ColorService.NUM_COLORS;
  }
}
