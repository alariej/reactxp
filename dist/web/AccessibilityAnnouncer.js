"use strict";
/**
 * AccessibilityAnnouncer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements the behavior for announcing text to screen readers, using aria-live regions.
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
var Interfaces_1 = require("../common/Interfaces");
var Timers_1 = require("../common/utils/Timers");
var Accessibility_1 = require("./Accessibility");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Styles_1 = require("./Styles");
var _isMac = (typeof navigator !== 'undefined') && (typeof navigator.platform === 'string') && (navigator.platform.indexOf('Mac') >= 0);
var _styles = {
    liveRegionContainer: Styles_1.default.combine({
        position: 'absolute',
        overflow: 'hidden',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        whiteSpace: 'pre',
    }),
};
var AccessibilityAnnouncer = /** @class */ (function (_super) {
    __extends(AccessibilityAnnouncer, _super);
    function AccessibilityAnnouncer(props) {
        var _this = _super.call(this, props) || this;
        // Update announcement text.
        _this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(function (announcement) {
                if (_this.state.announcementText === announcement) {
                    // If the previous announcement is the same as the current announcement
                    // we will append a ' ' to it. This ensures that the text in DOM of aria-live region changes
                    // and  will be read by screen Reader
                    announcement += ' ';
                }
                if (_isMac) {
                    // annnouncementText should never be in nested div for mac.
                    // Voice over ignores reading nested divs in aria-live container.
                    _this.setState({
                        announcementText: announcement,
                    });
                }
                else {
                    // Additionally, alternate between announcement text directly under the aria-live element and
                    // nested in a div to work around issues with some readers. NVDA on Windows is known to
                    // not announce aria-live reliably without this, for example.
                    _this.setState({
                        announcementText: announcement,
                        announcementTextInNestedDiv: !_this.state.announcementTextInNestedDiv,
                    });
                }
            });
        _this.state = _this._getInitialState();
        return _this;
    }
    AccessibilityAnnouncer.prototype._getInitialState = function () {
        return {
            announcementText: '',
            announcementTextInNestedDiv: false,
        };
    };
    AccessibilityAnnouncer.prototype.componentDidUpdate = function (prevProps, prevState) {
        // When a new announcement text is set in the live region, start a timer to clear the text from the div so that it can't be focused
        // using a screen reader.
        if (prevState.announcementText !== this.state.announcementText && this.state.announcementText) {
            this._startClearAnnouncementTimer();
        }
    };
    AccessibilityAnnouncer.prototype.componentWillUnmount = function () {
        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }
    };
    AccessibilityAnnouncer.prototype.render = function () {
        var announcement = this.state.announcementTextInNestedDiv ?
            (React.createElement("div", null,
                " ",
                this.state.announcementText,
                " ")) :
            this.state.announcementText;
        return (React.createElement("div", { style: _styles.liveRegionContainer, "aria-live": AccessibilityUtil_1.default.accessibilityLiveRegionToString(Interfaces_1.Types.AccessibilityLiveRegion.Assertive), "aria-atomic": 'true', "aria-relevant": 'additions text' }, announcement));
    };
    AccessibilityAnnouncer.prototype._cancelClearAnnouncementTimer = function () {
        if (this._clearAnnouncementTimer) {
            Timers_1.default.clearTimeout(this._clearAnnouncementTimer);
            this._clearAnnouncementTimer = undefined;
        }
    };
    AccessibilityAnnouncer.prototype._startClearAnnouncementTimer = function () {
        var _this = this;
        this._cancelClearAnnouncementTimer();
        this._clearAnnouncementTimer = Timers_1.default.setTimeout(function () {
            _this.setState({
                announcementText: '',
            });
        }, 2000);
    };
    return AccessibilityAnnouncer;
}(React.Component));
exports.AccessibilityAnnouncer = AccessibilityAnnouncer;
exports.default = AccessibilityAnnouncer;
