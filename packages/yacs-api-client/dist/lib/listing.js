"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var spraypaint_1 = require("spraypaint");
var application_record_1 = require("./application-record");
var Listing = /** @class */ (function (_super) {
    __extends(Listing, _super);
    function Listing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Listing.jsonapiType = "listings";
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "tags", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "active", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "maxCredits", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "minCredits", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "description", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "longname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "courseShortname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "subjectShortname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Listing.prototype, "uuid", void 0);
    __decorate([
        spraypaint_1.BelongsTo()
    ], Listing.prototype, "course", void 0);
    __decorate([
        spraypaint_1.BelongsTo()
    ], Listing.prototype, "term", void 0);
    __decorate([
        spraypaint_1.HasMany()
    ], Listing.prototype, "sections", void 0);
    Listing = __decorate([
        spraypaint_1.Model()
    ], Listing);
    return Listing;
}(application_record_1.ApplicationRecord));
exports.Listing = Listing;
