"use strict";
/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestureView = void 0;
var React = require("react");
var RN = require("react-native");
var App_1 = require("../native-common/App");
var GestureView_1 = require("../common/GestureView");
var Interfaces_1 = require("../common/Interfaces");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var EventHelpers_1 = require("./utils/EventHelpers");
var Platform_1 = require("./Platform");
var UserInterface_1 = require("./UserInterface");
var ViewBase_1 = require("./ViewBase");
var _defaultImportantForAccessibility = Interfaces_1.Types.ImportantForAccessibility.Yes;
var _isNativeMacOs = Platform_1.default.getType() === 'macos';
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView(props) {
        var _this = _super.call(this, props) || this;
        _this._macos_sendTapEvent = function (e) {
            var gsState = _this._mouseEventToTapGestureState(e);
            _this._sendTapEvent(gsState);
        };
        _this._onRef = function (ref) {
            _this._view = ref || undefined;
        };
        _this._onKeyPress = function (e) {
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(EventHelpers_1.default.toKeyboardEvent(e));
            }
        };
        // Setup Pan Responder
        _this._panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: function (e, gestureState) {
                var event = e.nativeEvent;
                UserInterface_1.default.evaluateTouchLatency(e);
                return _this._onTouchSeriesStart(event);
            },
            onMoveShouldSetPanResponder: function (e, gestureState) {
                var event = e.nativeEvent;
                UserInterface_1.default.evaluateTouchLatency(e);
                return _this._onTouchChange(event, gestureState);
            },
            onPanResponderRelease: function (e, gestureState) {
                var event = e.nativeEvent;
                _this._onTouchSeriesFinished(event, gestureState);
            },
            onPanResponderTerminate: function (e, gestureState) {
                var event = e.nativeEvent;
                _this._onTouchSeriesFinished(event, gestureState);
            },
            onPanResponderMove: function (e, gestureState) {
                var event = e.nativeEvent;
                UserInterface_1.default.evaluateTouchLatency(e);
                _this._onTouchChange(event, gestureState);
            },
            // Something else wants to become responder. Should this view release the responder?
            // Returning true allows release
            onPanResponderTerminationRequest: function (e, gestureState) { return !!_this.props.releaseOnRequest; },
        });
        return _this;
    }
    GestureView.prototype.render = function () {
        var importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, _defaultImportantForAccessibility);
        var accessibilityTrait = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        var accessibilityComponentType = AccessibilityUtil_1.default.accessibilityComponentTypeToString(this.props.accessibilityTraits);
        var extendedProps = {
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyPress: this.props.onKeyPress ? this._onKeyPress : undefined,
        };
        if (_isNativeMacOs && App_1.default.supportsExperimentalKeyboardNavigation && this.props.onTap) {
            extendedProps.onClick = this._macos_sendTapEvent;
            if (this.props.tabIndex === undefined || this.props.tabIndex >= 0) {
                extendedProps.acceptsKeyboardFocus = true;
                extendedProps.enableFocusRing = true;
            }
        }
        return (React.createElement(RN.View, __assign({ ref: this._onRef, style: [ViewBase_1.default.getDefaultViewStyle(), this.props.style], importantForAccessibility: importantForAccessibility, accessibilityTraits: accessibilityTrait, accessibilityComponentType: accessibilityComponentType, accessibilityLabel: this.props.accessibilityLabel, testID: this.props.testId }, this._panResponder.panHandlers, extendedProps), this.props.children));
    };
    GestureView.prototype.focus = function () {
        if (this._view && this._view.focus) {
            this._view.focus();
        }
    };
    GestureView.prototype.blur = function () {
        if (this._view && this._view.blur) {
            this._view.blur();
        }
    };
    return GestureView;
}(GestureView_1.default));
exports.GestureView = GestureView;
exports.default = GestureView;
