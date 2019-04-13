import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";

export class Period {
	day: number;
	start: string;
	end: string;
	type: string;
	location: string;
	section: Section;
}

@Model()
export class Section extends ApplicationRecord {
	static jsonapiType = "sections";

	@Attr() active: boolean;
	@Attr() shortname: string;
	@Attr() crn: string;
	@Attr() instructors: string[];
	@Attr() seats: number;
	@Attr() seatsTaken: number;
	@Attr() uuid: string;
	@Attr() periods: Period[];
	@Attr() conflictIds: number[];
  @Attr() status: string;

	@BelongsTo() listing: Listing;
}
