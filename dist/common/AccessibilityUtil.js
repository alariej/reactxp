"use strict";
/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common accessibility interface for platform-specific accessibility utilities.
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityUtil = exports.AccessibilityPlatformUtil = exports.ImportantForAccessibilityMap = void 0;
var Interfaces_1 = require("../common/Interfaces");
exports.ImportantForAccessibilityMap = (_a = {},
    _a[Interfaces_1.Types.ImportantForAccessibility.Auto] = 'auto',
    _a[Interfaces_1.Types.ImportantForAccessibility.Yes] = 'yes',
    _a[Interfaces_1.Types.ImportantForAccessibility.No] = 'no',
    _a[Interfaces_1.Types.ImportantForAccessibility.NoHideDescendants] = 'no-hide-descendants',
    _a);
// Platform specific helpers exposed through Native-Common AccessibilityUtil.
var AccessibilityPlatformUtil = /** @class */ (function () {
    function AccessibilityPlatformUtil() {
    }
    return AccessibilityPlatformUtil;
}());
exports.AccessibilityPlatformUtil = AccessibilityPlatformUtil;
var AccessibilityUtil = /** @class */ (function () {
    function AccessibilityUtil() {
    }
    AccessibilityUtil.prototype.isHidden = function (importantForAccessibility) {
        // aria-hidden is false by default, returning true or undefined, so that it doesn't pollute the DOM.
        if (importantForAccessibility) {
            var importantForAccessibilityString = this.importantForAccessibilityToString(importantForAccessibility);
            if (importantForAccessibilityString === exports.ImportantForAccessibilityMap[Interfaces_1.Types.ImportantForAccessibility.NoHideDescendants]) {
                return true;
            }
        }
        return undefined;
    };
    AccessibilityUtil.prototype.importantForAccessibilityToString = function (importantForAccessibility, defaultImportantForAccessibility) {
        importantForAccessibility = importantForAccessibility || defaultImportantForAccessibility;
        if (importantForAccessibility && exports.ImportantForAccessibilityMap[importantForAccessibility]) {
            return exports.ImportantForAccessibilityMap[importantForAccessibility];
        }
        return undefined;
    };
    return AccessibilityUtil;
}());
exports.AccessibilityUtil = AccessibilityUtil;
