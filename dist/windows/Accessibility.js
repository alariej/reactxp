"use strict";
/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
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
var Accessibility_1 = require("../native-common/Accessibility");
// Be aware that we import class and extend it here, but the default export of native-common/Accessibility
// is an instance of the class we import here. So any state in the default export from native-common will be in
// a different instance than default export of this windows/Accessibility. For example, susbscribing to
// newAnnouncementReadyEvent on this default export instance and calling announceForAccessibility on
// native-common default export will not raise this instance event.
var Accessibility = /** @class */ (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        var _this = _super.call(this) || this;
        // Work around the fact that the public react-native type definition doesn't
        // include initialHighContrast in RN.AccessibilityInfoStatic.
        _this._isHighContrast = RN.AccessibilityInfo.initialHighContrast || false;
        // Work around the fact that the public react-native type definition doesn't
        // include 'highContrastDidChange' in RN.AccessibilityEventName.
        RN.AccessibilityInfo.addEventListener('highContrastDidChange', function (isEnabled) { return _this._updateIsHighContrast(isEnabled); });
        return _this;
    }
    Accessibility.prototype._updateIsHighContrast = function (isEnabled) {
        if (this._isHighContrast !== isEnabled) {
            this._isHighContrast = isEnabled;
            this.highContrastChangedEvent.fire(isEnabled);
        }
    };
    Accessibility.prototype.isHighContrastEnabled = function () {
        return this._isHighContrast;
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
exports.default = new Accessibility();
