"use strict";
/**
 * AppVisibilityUtils.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific helpers for firing focus/activity related events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVisibilityUtils = void 0;
var subscribableevent_1 = require("subscribableevent");
var Timers_1 = require("../../common/utils/Timers");
var lodashMini_1 = require("./lodashMini");
var idleTimeInMs = 60 * 1000;
var AppVisibilityUtils = /** @class */ (function () {
    function AppVisibilityUtils() {
        var _this = this;
        this._isIdle = false;
        this.onFocusedEvent = new subscribableevent_1.default();
        this.onBlurredEvent = new subscribableevent_1.default();
        this.onAppForegroundedEvent = new subscribableevent_1.default();
        this.onAppBackgroundedEvent = new subscribableevent_1.default();
        this.onIdleEvent = new subscribableevent_1.default();
        this.onWakeUpEvent = new subscribableevent_1.default();
        this._wakeUpAndSetTimerForIdle = function () {
            if (!lodashMini_1.isUndefined(_this._timer)) {
                Timers_1.default.clearTimeout(_this._timer);
            }
            if (!_this.hasFocus()) {
                return;
            }
            if (_this.hasFocus() && _this._isIdle) {
                _this._onWakeUp();
            }
            _this._timer = Timers_1.default.setTimeout(function () {
                if (_this.hasFocus()) {
                    _this._onIdle();
                }
            }, idleTimeInMs);
        };
        this._onFocus = function () {
            _this._wakeUpAndSetTimerForIdle();
            _this.onFocusedEvent.fire();
        };
        this._onBlur = function () {
            _this._onIdle();
            _this.onBlurredEvent.fire();
        };
        this._onAppVisibilityChanged = function () {
            if (document.hidden) {
                _this.onAppBackgroundedEvent.fire();
            }
            else {
                _this.onAppForegroundedEvent.fire();
            }
        };
        this._onWakeUp = function () {
            _this._isIdle = false;
            _this.onWakeUpEvent.fire();
        };
        this._onIdle = function () {
            _this._isIdle = true;
            _this.onIdleEvent.fire();
        };
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            window.addEventListener('focus', this._onFocus);
            window.addEventListener('blur', this._onBlur);
            document.addEventListener('visibilitychange', this._onAppVisibilityChanged);
            this._trackIdleStatus();
        }
    }
    AppVisibilityUtils.prototype.hasFocusAndActive = function () {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return document.hasFocus() && !this._isIdle;
        }
        return true;
    };
    AppVisibilityUtils.prototype.hasFocus = function () {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return document.hasFocus();
        }
        return true;
    };
    AppVisibilityUtils.prototype.isAppInForeground = function () {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return !document.hidden;
        }
        return true;
    };
    AppVisibilityUtils.prototype._trackIdleStatus = function () {
        document.addEventListener('mousemove', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('keyup', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('touchstart', this._wakeUpAndSetTimerForIdle);
        document.addEventListener('scroll', this._wakeUpAndSetTimerForIdle);
        this._wakeUpAndSetTimerForIdle();
    };
    return AppVisibilityUtils;
}());
exports.AppVisibilityUtils = AppVisibilityUtils;
exports.default = new AppVisibilityUtils();
