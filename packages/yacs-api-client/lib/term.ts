import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";

export class Term extends ApplicationRecord {
	static jsonapiType = "terms";

	@Attr() longname: string
	@Attr() shortname: string
	@Attr() uuid: string
	//@Attr() id: number
}
