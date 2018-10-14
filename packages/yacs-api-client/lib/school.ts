import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
  // etc
} from "spraypaint"

import { ApplicationRecord } from "./application-record";

export class School extends ApplicationRecord {
	static jsonapiType = "schools";

	@Attr() shortname: string
	@Attr() longname: string
	@Attr() uuid: string
}
