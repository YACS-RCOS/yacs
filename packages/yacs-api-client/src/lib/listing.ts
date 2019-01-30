import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Course } from "./course";
import { Term } from "./term";
import { Section } from "./section";

@Model()
export class Listing extends ApplicationRecord {
	static jsonapiType = "listings";

	@Attr() tags: string[];
	@Attr() active: boolean;
	@Attr() maxCredits: number;
	@Attr() minCredits: number;
	@Attr() description: string;
	@Attr() longname: string;
	@Attr() courseShortname: string;
	@Attr() subjectShortname: string;
	@Attr() uuid: string;

	@BelongsTo() course: Course;
	@BelongsTo() term: Term;
	@HasMany() sections: Section[];
}
