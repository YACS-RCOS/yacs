import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";

export class Listing extends ApplicationRecord {
	static jsonapiType = "listings";

	@Attr() tags: string[]
	@Attr() active: boolean
	@Attr() max_credits: number
	@Attr() min_credits: number
	@Attr() description: string
	@Attr() longname: string
	@Attr() uuid: string
	//@Attr() id: number
}
