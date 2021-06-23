"use strict";
/**
 * AccessibilityAnnouncer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements the behavior for announcing text via screen readers.
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
exports.AccessibilityAnnouncer = void 0;
var React = require("react");
var RN = require("react-native");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var Interfaces_1 = require("../common/Interfaces");
var Styles_1 = require("../native-common/Styles");
var Timers_1 = require("../common/utils/Timers");
var Accessibility_1 = require("./Accessibility");
var _styles = {
    liveRegionContainer: Styles_1.default.createViewStyle({
        position: 'absolute',
        opacity: 0,
        top: -30,
        height: 30,
        left: 0,
        right: 0,
    }),
};
var AccessibilityAnnouncer = /** @class */ (function (_super) {
    __extends(AccessibilityAnnouncer, _super);
    function AccessibilityAnnouncer(props) {
        var _this = _super.call(this, props) || this;
        _this._viewElement = null;
        _this._announcementQueue = [];
        _this._onViewRef = function (view) {
            _this._viewElement = view;
            if (view !== null) {
                _this._tryDequeueAndAnnounce();
            }
        };
        _this._dequeueAndPostAnnouncement = function () {
            if (_this._announcementQueue.length > 0) {
                if (_this._viewElement) {
                    var announcement = _this._announcementQueue.shift();
                    // This hack was copied from android/Accessibility.ts in order to not increase variety of hacks in codebase.
                    //
                    // Screen reader fails to announce, if the new announcement is the same as the last one.
                    // The behavior is screen reader specific. NVDA is better than Narrator in this situation but
                    // ultimately does not fully support this case. Narrator tends to ignore subsequent identical texts at all.
                    // NVDA tends to announce 2 or 3 subsequent identical texts but usually ignores 4+ ones.
                    var textToAnnounce = (announcement && announcement === _this._lastAnnouncement) ? announcement + ' ' : announcement;
                    _this._viewElement.setNativeProps({ accessibilityLabel: textToAnnounce });
                    _this._lastAnnouncement = textToAnnounce;
                    // 2 seconds is probably enough for screen reader to finally receive UIA live region event
                    // and go query the accessible name of the region to put into its own queue, so that we can
                    // set name of the region to next announcement and fire the UIA live region event again.
                    // The magic number is copied from web/AccessibilityAnnouncer clear timer.
                    _this._announcementQueueTimer = Timers_1.default.setTimeout(_this._dequeueAndPostAnnouncement, 2000);
                }
            }
            else {
                if (_this._viewElement) {
                    // We want to hide the view used for announcement from screen reader so user cannot navigate to it.
                    // We do it by emptying accessible name on it as soon as possible - after we think screen reader
                    // already processed live region event.
                    _this._viewElement.setNativeProps({ accessibilityLabel: '' });
                }
                _this._lastAnnouncement = undefined;
                _this._announcementQueueTimer = undefined;
            }
        };
        // Update announcement text.
        _this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(function (announcement) {
                _this._announcementQueue.push(announcement);
                _this._tryDequeueAndAnnounce();
            });
        return _this;
    }
    AccessibilityAnnouncer.prototype.componentWillUnmount = function () {
        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }
        if (this._announcementQueueTimer) {
            Timers_1.default.clearTimeout(this._announcementQueueTimer);
            this._announcementQueueTimer = undefined;
        }
    };
    AccessibilityAnnouncer.prototype.render = function () {
        return (React.createElement(RN.View, { ref: this._onViewRef, style: _styles.liveRegionContainer, accessibilityLiveRegion: AccessibilityUtil_1.default.accessibilityLiveRegionToString(Interfaces_1.Types.AccessibilityLiveRegion.Assertive) }));
    };
    AccessibilityAnnouncer.prototype._tryDequeueAndAnnounce = function () {
        if (this._announcementQueueTimer === undefined) {
            this._dequeueAndPostAnnouncement();
        }
    };
    return AccessibilityAnnouncer;
}(React.Component));
exports.AccessibilityAnnouncer = AccessibilityAnnouncer;
exports.default = AccessibilityAnnouncer;
