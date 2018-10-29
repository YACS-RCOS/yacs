import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";
import { Course } from "./course";
import { Term } from "./term";
import { Section } from "./section";

@Model()
export class Listing extends ApplicationRecord {
	static jsonapiType = "listings";

	@Attr() tags: string[]
	@Attr() active: boolean
	@Attr() max_credits: number
	@Attr() min_credits: number
	@Attr() description: string
	@Attr() longname: string
	@Attr() uuid: string

	@BelongsTo() course: Course
	@BelongsTo() term: Term
	@HasMany() sections: Section[]
}
