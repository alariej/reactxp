"use strict";
/**
 * UserPresence.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the ReactXP interfaces related to
 * user presence.
 *
 * User is considered present when user is focused on the App and has interacted with the App in the last 60 seconds.
 * User is considered not present, if app is not focused (backgrounded or blurred) or the app is focused
 * but the user has not intereacted with the app in the last 60 seconds
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
exports.UserPresence = void 0;
var RX = require("../common/Interfaces");
var AppVisibilityUtils_1 = require("./utils/AppVisibilityUtils");
var UserPresence = /** @class */ (function (_super) {
    __extends(UserPresence, _super);
    function UserPresence() {
        var _this = _super.call(this) || this;
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            _this._isPresent = AppVisibilityUtils_1.default.hasFocusAndActive();
            AppVisibilityUtils_1.default.onFocusedEvent.subscribe(_this._handleFocus.bind(_this));
            AppVisibilityUtils_1.default.onBlurredEvent.subscribe(_this._handleBlur.bind(_this));
            AppVisibilityUtils_1.default.onWakeUpEvent.subscribe(_this._handleWakeup.bind(_this));
            AppVisibilityUtils_1.default.onIdleEvent.subscribe(_this._handleIdle.bind(_this));
        }
        else {
            _this._isPresent = false;
        }
        return _this;
    }
    UserPresence.prototype.isUserPresent = function () {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return this._isPresent;
        }
        else {
            return true;
        }
    };
    UserPresence.prototype._setUserPresent = function (isPresent) {
        if (this._isPresent !== isPresent) {
            this._isPresent = isPresent;
            this.userPresenceChangedEvent.fire(isPresent);
        }
    };
    UserPresence.prototype._handleWakeup = function () {
        this._setUserPresent(true);
    };
    UserPresence.prototype._handleIdle = function () {
        this._setUserPresent(false);
    };
    UserPresence.prototype._handleFocus = function () {
        this._setUserPresent(true);
    };
    UserPresence.prototype._handleBlur = function () {
        this._setUserPresent(false);
    };
    return UserPresence;
}(RX.UserPresence));
exports.UserPresence = UserPresence;
var instance = new UserPresence();
exports.default = instance;
