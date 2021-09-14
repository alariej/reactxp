"use strict";
/**
 * TextInput.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform TextInput abstraction.
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
exports.TextInput = void 0;
var React = require("react");
var RN = require("react-native");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var FocusManager_1 = require("../native-desktop/utils/FocusManager");
var Interfaces_1 = require("../common/Interfaces");
var TextInput_1 = require("../native-common/TextInput");
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextInput.prototype._render = function (props, onMount) {
        var _this = this;
        var extendedProps = {
            tabIndex: this.getTabIndex(),
        };
        return (React.createElement(RN.TextInput, __assign({}, props, extendedProps, { ref: onMount, importantForAccessibility: this.getImportantForAccessibility(), onFocus: function (e) { _this._onFocusEx(e, props.onFocus); } })));
    };
    TextInput.prototype._onFocusEx = function (e, origHandler) {
        if (e.currentTarget === e.target) {
            this.onFocus();
        }
        if (origHandler) {
            origHandler(e);
        }
    };
    // From FocusManagerFocusableComponent interface
    //
    TextInput.prototype.onFocus = function () {
        // Focus Manager hook
    };
    TextInput.prototype.getTabIndex = function () {
        // Focus Manager may override this
        return this.props.tabIndex || 0;
    };
    TextInput.prototype.getImportantForAccessibility = function () {
        // Focus Manager may override this
        // Note: currently native-common flavor doesn't pass any accessibility properties to RN.TextInput.
        // This should ideally be fixed.
        // We force a default of Auto if no property is provided
        return AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, Interfaces_1.Types.ImportantForAccessibility.Auto);
    };
    TextInput.prototype.updateNativeAccessibilityProps = function () {
        if (this._mountedComponent) {
            var tabIndex = this.getTabIndex();
            var importantForAccessibility = this.getImportantForAccessibility();
            this._mountedComponent.setNativeProps({
                tabIndex: tabIndex,
                value: this.state.inputValue,
                isTabStop: this.props.editable && tabIndex >= 0,
                importantForAccessibility: importantForAccessibility,
            });
        }
    };
    return TextInput;
}(TextInput_1.TextInput));
exports.TextInput = TextInput;
(0, FocusManager_1.applyFocusableComponentMixin)(TextInput);
exports.default = TextInput;
