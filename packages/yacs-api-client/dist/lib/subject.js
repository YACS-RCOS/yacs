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
var Subject = /** @class */ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Subject.jsonapiType = "subjects";
    __decorate([
        spraypaint_1.Attr()
    ], Subject.prototype, "longname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Subject.prototype, "shortname", void 0);
    __decorate([
        spraypaint_1.Attr()
    ], Subject.prototype, "uuid", void 0);
    __decorate([
        spraypaint_1.BelongsTo()
    ], Subject.prototype, "school", void 0);
    __decorate([
        spraypaint_1.HasMany()
    ], Subject.prototype, "courses", void 0);
    Subject = __decorate([
        spraypaint_1.Model()
    ], Subject);
    return Subject;
}(application_record_1.ApplicationRecord));
exports.Subject = Subject;
