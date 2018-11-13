import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";

@Model()
export class Term extends ApplicationRecord {
	static jsonapiType = "terms";

	@Attr() longname: string;
	@Attr() shortname: string;
	@Attr() uuid: string;

	@HasMany() listings: Listing[];
}
