"use strict";
/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web wrapper for subscribing or querying the current state of the
 * screen reader.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessibility = void 0;
var Accessibility_1 = require("../common/Accessibility");
var Accessibility = /** @class */ (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Calling this API on web has no effect.
    Accessibility.prototype.isScreenReaderEnabled = function () {
        return false;
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
exports.default = new Accessibility();
