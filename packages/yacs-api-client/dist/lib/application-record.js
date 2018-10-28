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
Object.defineProperty(exports, "__esModule", { value: true });
var spraypaint_1 = require("spraypaint");
var ApplicationRecord = /** @class */ (function (_super) {
    __extends(ApplicationRecord, _super);
    function ApplicationRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplicationRecord.baseUrl = "https://nightly.yacs.io";
    ApplicationRecord.apiNamespace = "/api/v6";
    return ApplicationRecord;
}(spraypaint_1.SpraypaintBase));
exports.ApplicationRecord = ApplicationRecord;
