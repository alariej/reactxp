"use strict";
/**
 * Popup.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Popup abstraction.
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
exports.Popup = void 0;
var assert_1 = require("../common/assert");
var RX = require("../common/Interfaces");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Popup.prototype.show = function (options, popupId, delay) {
        (0, assert_1.default)(popupId, "popupId must be a non-empty string. Actual: " + popupId);
        return FrontLayerViewManager_1.default.showPopup(options, popupId, delay);
    };
    Popup.prototype.autoDismiss = function (popupId, delay) {
        (0, assert_1.default)(popupId, "popupId must be a non-empty string. Actual: " + popupId);
        FrontLayerViewManager_1.default.autoDismissPopup(popupId, delay);
    };
    Popup.prototype.dismiss = function (popupId) {
        (0, assert_1.default)(popupId, "popupId must be a non-empty string. Actual: " + popupId);
        FrontLayerViewManager_1.default.dismissPopup(popupId);
    };
    Popup.prototype.dismissAll = function () {
        FrontLayerViewManager_1.default.dismissAllPopups();
    };
    Popup.prototype.isDisplayed = function (popupId) {
        return FrontLayerViewManager_1.default.isPopupDisplayed(popupId);
    };
    return Popup;
}(RX.Popup));
exports.Popup = Popup;
exports.default = new Popup();
