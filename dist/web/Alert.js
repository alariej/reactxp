"use strict";
/**
 * Alert.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes.
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
exports.Alert = void 0;
var React = require("react");
var RX = require("../common/Interfaces");
var AlertModalContent_1 = require("./AlertModalContent");
var Modal_1 = require("./Modal");
// Web/HTML implementation for alert dialog boxes
var Alert = /** @class */ (function (_super) {
    __extends(Alert, _super);
    function Alert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._modalId = 'RX.Alert_WebModal';
        return _this;
    }
    Alert.prototype.show = function (title, message, buttons, options) {
        Modal_1.default.show((React.createElement(AlertModalContent_1.AlertModalContent, { modalId: this._modalId, buttons: buttons, title: title, message: message, theme: options && options.theme, preventDismissOnPress: options && options.preventDismissOnPress })), this._modalId);
    };
    return Alert;
}(RX.Alert));
exports.Alert = Alert;
exports.default = new Alert();
