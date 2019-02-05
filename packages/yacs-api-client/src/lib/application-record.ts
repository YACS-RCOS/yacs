import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany
} from "spraypaint";

@Model()
export class ApplicationRecord extends SpraypaintBase {
  static baseUrl = "";
  static apiNamespace = "/api/v6";
}
