import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";
import { Listing } from "./listing";

@Model()
export class Course extends ApplicationRecord {
	static jsonapiType = "courses";

	@Attr() shortname: string;
	@Attr() uuid: string;

	@BelongsTo() subject: Subject;
	@HasMany() listings: Listing[];
}
