"use strict";
/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of accessiblity functions for cross-platform
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityUtil = void 0;
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var Interfaces_1 = require("../common/Interfaces");
var _ = require("./utils/lodashMini");
var liveRegionMap = (_a = {},
    _a[Interfaces_1.Types.AccessibilityLiveRegion.None] = 'none',
    _a[Interfaces_1.Types.AccessibilityLiveRegion.Assertive] = 'assertive',
    _a[Interfaces_1.Types.AccessibilityLiveRegion.Polite] = 'polite',
    _a);
// iOS supported map.
var traitsMap = (_b = {},
    _b[Interfaces_1.Types.AccessibilityTrait.None] = 'none',
    // NOTE: Tab trait isn't supported on iOS. Setting it to none, allows us to give it a custom
    // label. This needs to be done for any custom role, which needs to be supported on iOS.
    _b[Interfaces_1.Types.AccessibilityTrait.Tab] = 'none',
    _b[Interfaces_1.Types.AccessibilityTrait.Button] = 'button',
    _b[Interfaces_1.Types.AccessibilityTrait.Link] = 'link',
    _b[Interfaces_1.Types.AccessibilityTrait.Header] = 'header',
    _b[Interfaces_1.Types.AccessibilityTrait.Search] = 'search',
    _b[Interfaces_1.Types.AccessibilityTrait.Image] = 'image',
    _b[Interfaces_1.Types.AccessibilityTrait.Summary] = 'summary',
    _b[Interfaces_1.Types.AccessibilityTrait.Adjustable] = 'adjustable',
    _b[Interfaces_1.Types.AccessibilityTrait.Selected] = 'selected',
    _b[Interfaces_1.Types.AccessibilityTrait.Plays] = 'plays',
    _b[Interfaces_1.Types.AccessibilityTrait.Key] = 'key',
    _b[Interfaces_1.Types.AccessibilityTrait.Text] = 'text',
    _b[Interfaces_1.Types.AccessibilityTrait.Disabled] = 'disabled',
    _b[Interfaces_1.Types.AccessibilityTrait.FrequentUpdates] = 'frequentUpdates',
    _b[Interfaces_1.Types.AccessibilityTrait.StartsMedia] = 'startsMedia',
    _b[Interfaces_1.Types.AccessibilityTrait.AllowsDirectInteraction] = 'allowsDirectionInteraction',
    _b[Interfaces_1.Types.AccessibilityTrait.PageTurn] = 'pageTurn',
    _b[Interfaces_1.Types.AccessibilityTrait.ListItem] = 'listItem',
    _b);
// Android supported map.
var componentTypeMap = (_c = {},
    _c[Interfaces_1.Types.AccessibilityTrait.None] = 'none',
    // NOTE: Tab component type isn't supported on Android. Setting it to none, allows us to give
    // it a custom label. This needs to be done for any custom role, which needs to be supported
    // on Android.
    _c[Interfaces_1.Types.AccessibilityTrait.Tab] = 'none',
    _c[Interfaces_1.Types.AccessibilityTrait.Button] = 'button',
    _c[Interfaces_1.Types.AccessibilityTrait.Radio_button_checked] = 'radiobutton_checked',
    _c[Interfaces_1.Types.AccessibilityTrait.Radio_button_unchecked] = 'radiobutton_unchecked',
    _c);
var AccessibilityUtil = /** @class */ (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessibilityUtil.prototype.setAccessibilityPlatformUtil = function (instance) {
        this._instance = instance;
    };
    // Converts an AccessibilityTrait to a string, but the returned value is only needed for iOS and UWP. Other platforms ignore it.
    // Presence of an AccessibilityTrait.None can make an element non-accessible on Android.
    // We use the override traits if they are present, else use the default trait.
    // If ensureDefaultTrait is true, ensure the return result contains the defaultTrait.
    AccessibilityUtil.prototype.accessibilityTraitToString = function (overrideTraits, defaultTrait, ensureDefaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }
        var traits;
        if (defaultTrait && ensureDefaultTrait) {
            if (Array.isArray(overrideTraits)) {
                traits = overrideTraits.indexOf(defaultTrait) === -1 ? overrideTraits.concat([defaultTrait]) : overrideTraits;
            }
            else {
                traits = overrideTraits === defaultTrait ? [overrideTraits] : [overrideTraits, defaultTrait];
            }
        }
        else {
            traits = Array.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        }
        return _.compact(_.map(traits, function (t) { return t ? traitsMap[t] : undefined; }));
    };
    // Converts an AccessibilityTrait to an accessibilityComponentType string, but the returned value is only needed for Android. Other
    // platforms ignore it.
    AccessibilityUtil.prototype.accessibilityComponentTypeToString = function (overrideTraits, defaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        // Max enum value in this array is the componentType for android.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }
        var combinedTraits = Array.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        var maxTrait = _.max(_.filter(combinedTraits, function (t) { return componentTypeMap.hasOwnProperty(t); }));
        return maxTrait ? componentTypeMap[maxTrait] : undefined;
    };
    // Converts an AccessibilityLiveRegion to a string, but the return value is only needed for Android. Other platforms ignore it.
    AccessibilityUtil.prototype.accessibilityLiveRegionToString = function (liveRegion) {
        if (liveRegion && liveRegionMap[liveRegion]) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    };
    // Platform specific accessibility APIs.
    AccessibilityUtil.prototype.setAccessibilityFocus = function (component) {
        this._instance.setAccessibilityFocus(component);
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityUtil));
exports.AccessibilityUtil = AccessibilityUtil;
exports.default = new AccessibilityUtil();
