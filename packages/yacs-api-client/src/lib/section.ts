import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint"

import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";

export class Section extends ApplicationRecord {
	static jsonapiType = "sections";

	@Attr() tags: string[]
	@Attr() active: boolean
	@Attr() max_credits: number
	@Attr() min_credits: number
	@Attr() description: string
	@Attr() longname: string
	@Attr() uuid: string

	@BelongsTo() listing: Listing
}
