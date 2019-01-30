import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

import { ApplicationRecord } from "./application-record";
import { Section } from "./section";

@Model()
export class Schedule extends ApplicationRecord {
	static jsonapiType = "schedules";

	@Attr() uuid: string;

	@HasMany() sections: Section[];
}
