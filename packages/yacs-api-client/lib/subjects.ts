import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";

export class Subject extends ApplicationRecord {
	static jsonapiType = "subjects";

	@Attr() longname: string
	@Attr() shortname: string
	@Attr() uuid: string
	@Attr() id: number
}
