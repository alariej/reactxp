"use strict";
/**
 * Platform.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of Platform interface.
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
exports.Platform = void 0;
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Platform = /** @class */ (function (_super) {
    __extends(Platform, _super);
    function Platform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Platform.prototype.getType = function () {
        return RN.Platform.OS;
    };
    Platform.prototype.select = function (specifics) {
        var platformType = this.getType();
        return platformType in specifics ? specifics[platformType] : specifics.default;
    };
    return Platform;
}(RX.Platform));
exports.Platform = Platform;
exports.default = new Platform();
