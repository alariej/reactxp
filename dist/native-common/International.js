"use strict";
/**
 * International.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation for i18n.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.International = void 0;
var RN = require("react-native");
var International = /** @class */ (function () {
    function International() {
        var _this = this;
        // RN.I18nManager.isRTL is a constant, a good start.
        this._isRTL = RN.I18nManager.isRTL;
        // Register for changes (some platforms may never raise this event)
        RN.DeviceEventEmitter.addListener('isRTLChanged', function (payload) { _this._isRTL = payload.isRTL; });
    }
    International.prototype.allowRTL = function (allow) {
        RN.I18nManager.allowRTL(allow);
    };
    International.prototype.forceRTL = function (force) {
        RN.I18nManager.forceRTL(force);
    };
    International.prototype.isRTL = function () {
        return this._isRTL;
    };
    return International;
}());
exports.International = International;
exports.default = new International();
