import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { School } from "./school";
import { Course } from "./course";

@Model()
export class Subject extends ApplicationRecord {
	static jsonapiType = "subjects";

	@Attr() longname: string;
	@Attr() shortname: string;
	@Attr() uuid: string;

	@BelongsTo() school: School;
	@HasMany() courses: Course[];
}
