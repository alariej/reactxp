"use strict";
/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native wrapper for accessibility helper.
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
var RN = require("react-native");
var Accessibility_1 = require("../common/Accessibility");
var AppConfig_1 = require("../common/AppConfig");
var Accessibility = /** @class */ (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        var _this = _super.call(this) || this;
        _this._isScreenReaderEnabled = false;
        var initialScreenReaderState = false;
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when screen reader is enabled or disabled.
            RN.AccessibilityInfo.addEventListener('screenReaderChanged', function (isEnabled) {
                initialScreenReaderState = true;
                _this._updateScreenReaderStatus(isEnabled);
            });
            // Fetch initial state.
            RN.AccessibilityInfo.isScreenReaderEnabled().then(function (isEnabled) {
                if (!initialScreenReaderState) {
                    _this._updateScreenReaderStatus(isEnabled);
                }
            }).catch(function (err) {
                if (AppConfig_1.default.isDevelopmentMode()) {
                    console.error('Accessibility: RN.AccessibilityInfo.isScreenReaderEnabled failed');
                }
            });
        }
        return _this;
    }
    Accessibility.prototype._updateScreenReaderStatus = function (isEnabled) {
        if (this._isScreenReaderEnabled !== isEnabled) {
            this._isScreenReaderEnabled = isEnabled;
            this.screenReaderChangedEvent.fire(isEnabled);
        }
    };
    Accessibility.prototype.isScreenReaderEnabled = function () {
        return this._isScreenReaderEnabled;
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
exports.default = new Accessibility();
