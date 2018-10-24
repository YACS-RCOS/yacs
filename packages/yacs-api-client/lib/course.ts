import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";
import { Listing } from "./listing";

export class Course extends ApplicationRecord {
	static jsonapiType = "courses";

	@Attr() tags: string[]
	@Attr() shortname: string
	@Attr() uuid: string
	//@Attr() id: number

	@BelongsTo() subjects: Subject[]
	@HasMany() listings: Listing[] 
}
