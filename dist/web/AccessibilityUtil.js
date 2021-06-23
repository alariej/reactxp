"use strict";
/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of accessiblity functions for cross-platform
 * ReactXP framework.
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityUtil = void 0;
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var Interfaces_1 = require("../common/Interfaces");
var _ = require("./utils/lodashMini");
// Map of accessibility trait to an aria role attribute.
// What's a role attribute? https://www.w3.org/wiki/PF/XTech/HTML5/RoleAttribute
var roleMap = (_a = {},
    _a[Interfaces_1.Types.AccessibilityTrait.None] = 'presentation',
    _a[Interfaces_1.Types.AccessibilityTrait.Button] = 'button',
    _a[Interfaces_1.Types.AccessibilityTrait.Link] = 'link',
    _a[Interfaces_1.Types.AccessibilityTrait.Header] = 'heading',
    _a[Interfaces_1.Types.AccessibilityTrait.Search] = 'search',
    _a[Interfaces_1.Types.AccessibilityTrait.Image] = 'img',
    _a[Interfaces_1.Types.AccessibilityTrait.Summary] = 'region',
    _a[Interfaces_1.Types.AccessibilityTrait.Adjustable] = 'slider',
    _a[Interfaces_1.Types.AccessibilityTrait.Menu] = 'menu',
    _a[Interfaces_1.Types.AccessibilityTrait.MenuItem] = 'menuitem',
    _a[Interfaces_1.Types.AccessibilityTrait.MenuBar] = 'menubar',
    _a[Interfaces_1.Types.AccessibilityTrait.Tab] = 'tab',
    _a[Interfaces_1.Types.AccessibilityTrait.TabList] = 'tablist',
    _a[Interfaces_1.Types.AccessibilityTrait.List] = 'list',
    _a[Interfaces_1.Types.AccessibilityTrait.ListItem] = 'listitem',
    _a[Interfaces_1.Types.AccessibilityTrait.ListBox] = 'listbox',
    _a[Interfaces_1.Types.AccessibilityTrait.Group] = 'group',
    _a[Interfaces_1.Types.AccessibilityTrait.CheckBox] = 'checkbox',
    _a[Interfaces_1.Types.AccessibilityTrait.ComboBox] = 'combobox',
    _a[Interfaces_1.Types.AccessibilityTrait.Log] = 'log',
    _a[Interfaces_1.Types.AccessibilityTrait.Status] = 'status',
    _a[Interfaces_1.Types.AccessibilityTrait.Dialog] = 'dialog',
    _a[Interfaces_1.Types.AccessibilityTrait.Switch] = 'switch',
    _a);
// Map of accesssibility live region to an aria-live property.
var liveRegionMap = (_b = {},
    _b[Interfaces_1.Types.AccessibilityLiveRegion.None] = 'off',
    _b[Interfaces_1.Types.AccessibilityLiveRegion.Assertive] = 'assertive',
    _b[Interfaces_1.Types.AccessibilityLiveRegion.Polite] = 'polite',
    _b);
var AccessibilityUtil = /** @class */ (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Web equivalent value for aria-live property.
    AccessibilityUtil.prototype.accessibilityLiveRegionToString = function (liveRegion) {
        if (liveRegion) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    };
    // Web equivalent value for role property.
    // NOTE: Web only supports a single aria-role on a component.
    AccessibilityUtil.prototype.accessibilityTraitToString = function (traits, defaultTrait) {
        // Combine & remove duplicate traits.
        var combinedTraits = defaultTrait ? [defaultTrait] : [];
        if (traits) {
            combinedTraits = _.union(combinedTraits, Array.isArray(traits) ? traits : [traits]);
        }
        // Max enum value in this array of traits is role for web. Return corresponding
        // role string from roleMap.
        return combinedTraits.length > 0 ?
            roleMap[_.max(_.filter(combinedTraits, function (t) { return roleMap.hasOwnProperty(t); }))]
            : undefined;
    };
    AccessibilityUtil.prototype.accessibilityTraitToAriaSelected = function (traits) {
        // Walk through each trait and check if there's a selected trait. Return if one is found.
        if (traits && Array.isArray(traits) && traits.indexOf(Interfaces_1.Types.AccessibilityTrait.Tab) !== -1) {
            return traits.indexOf(Interfaces_1.Types.AccessibilityTrait.Selected) !== -1;
        }
        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-selected = false" for every falsy condition
        return undefined;
    };
    AccessibilityUtil.prototype.accessibilityTraitToAriaChecked = function (traits) {
        // Walk through each trait and check if there's a checked trait. Return if one is found.
        if (traits && Array.isArray(traits) && traits.indexOf(Interfaces_1.Types.AccessibilityTrait.CheckBox) !== -1) {
            return traits.indexOf(Interfaces_1.Types.AccessibilityTrait.Checked) !== -1;
        }
        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-checked = false" for every falsy condition
        return undefined;
    };
    AccessibilityUtil.prototype.accessibilityTraitToAriaHasPopup = function (traits) {
        // Walk through each trait and check if there's a hasPopup trait. Return if one is found.
        if (traits && Array.isArray(traits) && traits.indexOf(Interfaces_1.Types.AccessibilityTrait.HasPopup) !== -1) {
            return traits.indexOf(Interfaces_1.Types.AccessibilityTrait.HasPopup) !== -1;
        }
        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-checked = false" for every falsy condition
        return undefined;
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityUtil));
exports.AccessibilityUtil = AccessibilityUtil;
exports.default = new AccessibilityUtil();
