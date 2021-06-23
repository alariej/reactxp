"use strict";
/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific accessibility utils.
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
exports.AccessibilityUtil = void 0;
var RN = require("react-native");
var Accessibility_1 = require("../native-common/Accessibility");
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var AccessibilityUtil = /** @class */ (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessibilityUtil.prototype._sendAccessibilityEvent = function (component, eventId) {
        // See list of events here:
        // https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent.html
        // For some reason, a small delay is required for the event to be properly processed.
        setTimeout(function () {
            var nodeHandle;
            // Component could be unmountend at the moment this function is executed and in
            // that case RN.findNodeHandle() will throw an exception.
            // We can't use just simple component.isMounted() checks as it's deprecated and
            // will throw red-screen in dev mode and I don't want to access _isMounted as
            // it's private prop.
            try {
                nodeHandle = RN.findNodeHandle(component);
            }
            catch (e) {
                // Intended noop, it's valid situation
            }
            if (nodeHandle) {
                RN.NativeModules.UIManager.sendAccessibilityEvent(nodeHandle, eventId);
            }
        }, 100);
    };
    AccessibilityUtil.prototype.setAccessibilityFocus = function (component) {
        var TYPE_VIEW_FOCUSED = 8;
        if (Accessibility_1.default.isScreenReaderEnabled()) {
            this._sendAccessibilityEvent(component, TYPE_VIEW_FOCUSED);
        }
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityPlatformUtil));
exports.AccessibilityUtil = AccessibilityUtil;
exports.default = new AccessibilityUtil();
