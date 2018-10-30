import {
  SpraypaintBase,
  attr,
  belongsTo,
  hasMany,
  HasMany,
  Attr,
  Model
  // etc
} from "spraypaint";
// const attr = spraypaint.attr;

// export const ApplicationRecord = SpraypaintBase.extend({
//   static: {
//   	baseUrl: "",
//   	apiNamespace: "/api/v6"
//   }
// });

// ApplicationRecord.middlewareStack = new MiddlewareStack();

// ApplicationRecord.baseClass = SpraypaintBase;

// export const School = ApplicationRecord.extend({
// 	static: {
// 		jsonapiType: "schools"
// 	},
// 	attrs: {
// 		longname: attr(),
// 		uuid: attr()
// 	}
// });

@Model()
class ApplicationRecord extends SpraypaintBase {
  static baseUrl = ""
  static apiNamespace = "/api/v6"
}

@Model()
export class School extends ApplicationRecord {
	static jsonapiType = "schools";

	@Attr() longname: string
	@Attr() uuid: string

	// @HasMany() subjects: Subject[]
}


// export class Subject extends ApplicationRecord {
// 	static jsonapiType = "subjects";

// 	@Attr() longname: string
// 	@Attr() shortname: string
// 	@Attr() uuid: string

// 	@BelongsTo() school: School
// 	@HasMany() courses: Course[]

// 	  static get baseClass() {
// 		return ApplicationRecord;
// 	}
// }

// export class Course extends ApplicationRecord {
// 	static jsonapiType = "courses";

// 	@Attr() shortname: string
// 	@Attr() uuid: string

// 	@BelongsTo() subject: Subject
// 	@HasMany() listings: Listing[]
// 	  static get baseClass() {
// 		return ApplicationRecord;
// 	}
// }

// export class Term extends ApplicationRecord {
// 	static jsonapiType = "terms";

// 	@Attr() longname: string
// 	@Attr() shortname: string
// 	@Attr() uuid: string

// 	@HasMany() listings: Listing[]
// 	  static get baseClass() {
// 		return ApplicationRecord;
// 	}
// }

// export class Listing extends ApplicationRecord {
// 	static jsonapiType = "listings";

// 	@Attr() tags: string[]
// 	@Attr() active: boolean
// 	@Attr() max_credits: number
// 	@Attr() min_credits: number
// 	@Attr() description: string
// 	@Attr() longname: string
// 	@Attr() uuid: string

// 	@BelongsTo() course: Course
// 	@BelongsTo() term: Term
// 	@HasMany() sections: Section[]
// 	  static get baseClass() {
// 		return ApplicationRecord;
// 	}
// }

// export class Section extends ApplicationRecord {
// 	static jsonapiType = "sections";

// 	@Attr() tags: string[]
// 	@Attr() active: boolean
// 	@Attr() max_credits: number
// 	@Attr() min_credits: number
// 	@Attr() description: string
// 	@Attr() longname: string
// 	@Attr() uuid: string

// 	@BelongsTo() listing: Listing
// 	  static get baseClass() {
// 		return ApplicationRecord;
// 	}
// }
