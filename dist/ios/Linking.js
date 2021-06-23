"use strict";
/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * iOS-specific implementation for deep linking.
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
exports.Linking = void 0;
var Linking_1 = require("../native-common/Linking");
var Linking = /** @class */ (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Escaped SMS uri - sms:<phoneNumber>&body=<messageString>
    Linking.prototype._createSmsUrl = function (smsInfo) {
        var smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }
        if (smsInfo.body) {
            // iOS uses the & delimiter instead of the regular ?.
            smsUrl += '&body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
exports.default = new Linking();
