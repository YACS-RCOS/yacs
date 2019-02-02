import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";

@Model()
export class School extends ApplicationRecord {
	static jsonapiType = "schools";

	@Attr() longname: string;
	@Attr() uuid: string;

	@HasMany() subjects: Subject[];
}
