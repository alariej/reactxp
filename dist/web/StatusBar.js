"use strict";
/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform status bar.
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
exports.StatusBar = void 0;
var RX = require("../common/Interfaces");
var StatusBar = /** @class */ (function (_super) {
    __extends(StatusBar, _super);
    function StatusBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBar.prototype.isOverlay = function () {
        return false;
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        // Nothing to do on Web
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        // Nothing to do on Web
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        // Nothing to do on the web
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        // Nothing to do on the web
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        // Nothing to do on the web
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
exports.default = new StatusBar();
