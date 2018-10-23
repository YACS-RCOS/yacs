import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";

export class Course extends ApplicationRecord {
	static jsonapiType = "courses";

	@Attr() tags: string[]
	@Attr() shortname: string
	@Attr() uuid: string
	//@Attr() id: number
}
