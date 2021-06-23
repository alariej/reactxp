"use strict";
/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific implementation of StatusBar APIs.
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
var RN = require("react-native");
var RX = require("../common/Interfaces");
var StatusBar = /** @class */ (function (_super) {
    __extends(StatusBar, _super);
    function StatusBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBar.prototype.isOverlay = function () {
        // Android draws the status bar as a view that takes up space
        // of its own, as opposed to an overlay like on iOS.
        return false;
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        RN.StatusBar.setBackgroundColor(color, animated);
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        RN.StatusBar.setTranslucent(translucent);
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        // Nothing to do on android
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        // Nothing to do on android
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
exports.default = new StatusBar();
