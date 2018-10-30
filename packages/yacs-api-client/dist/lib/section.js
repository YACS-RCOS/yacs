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
var Period = /** @class */ (function () {
    function Period() {
    }
    return Period;
}());
exports.Period = Period;
var Section = /** @class */ (function (_super) {
    __extends(Section, _super);
    function Section() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Section.jsonapiType = "sections";
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "active", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "shortname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "crn", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "instructors", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "seats", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "seatsTaken", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "uuid", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "periods", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Section.prototype, "conflictIds", void 0);
    __decorate([
        spraypaint_1.BelongsTo()
    ], Section.prototype, "listing", void 0);
    Section = __decorate([
        spraypaint_1.Model()
    ], Section);
    return Section;
}(application_record_1.ApplicationRecord));
exports.Section = Section;
