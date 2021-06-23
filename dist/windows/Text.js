"use strict";
/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Text abstraction.
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
exports.Text = void 0;
var PropTypes = require("prop-types");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var FocusManager_1 = require("../native-desktop/utils/FocusManager");
var Interfaces_1 = require("../common/Interfaces");
var Text_1 = require("../native-common/Text");
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._selectedText = '';
        _this._onSelectionChange = function (event) {
            _this._selectedText = event.nativeEvent.selectedText;
        };
        return _this;
    }
    Text.prototype._getExtendedProperties = function () {
        var superExtendedProps = _super.prototype._getExtendedProperties.call(this);
        return __assign(__assign({}, superExtendedProps), { onSelectionChange: this._onSelectionChange });
    };
    Text.prototype.requestFocus = function () {
        // UWP doesn't support casually focusing RN.Text elements. We override requestFocus in order to drop any focus requests
    };
    Text.prototype.getChildContext = function () {
        var childContext = _super.prototype.getChildContext.call(this);
        // This control will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
        // (more detailed description is in windows/View.tsx)
        childContext.isRxParentAFocusableInSameFocusManager = true;
        return childContext;
    };
    // From FocusManagerFocusableComponent interface
    //
    Text.prototype.onFocus = function () {
        // Focus Manager hook
        // Not used
    };
    Text.prototype.getTabIndex = function () {
        // Not used
        return -1;
    };
    Text.prototype.getImportantForAccessibility = function () {
        // Focus Manager may override this
        // We force a default of Auto if no property is provided
        return AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, Interfaces_1.Types.ImportantForAccessibility.Auto);
    };
    Text.prototype.updateNativeAccessibilityProps = function () {
        if (this._mountedComponent) {
            var importantForAccessibility = this.getImportantForAccessibility();
            this._mountedComponent.setNativeProps({
                importantForAccessibility: importantForAccessibility,
            });
        }
    };
    Text.prototype.getSelectedText = function () {
        return this._selectedText;
    };
    Text.contextTypes = __assign({ isRxParentAFocusableInSameFocusManager: PropTypes.bool }, Text_1.Text.contextTypes);
    Text.childContextTypes = __assign({ isRxParentAFocusableInSameFocusManager: PropTypes.bool }, Text_1.Text.childContextTypes);
    return Text;
}(Text_1.Text));
exports.Text = Text;
// Text is focusable just by screen readers
FocusManager_1.applyFocusableComponentMixin(Text, function (nextProps, nextState, nextCtx) {
    // This control should be tracked by a FocusManager if there's no other control tracked by the same FocusManager in
    // the parent path
    return nextCtx && ('isRxParentAFocusableInSameFocusManager' in nextCtx)
        ? !nextCtx.isRxParentAFocusableInSameFocusManager : !this.context.isRxParentAFocusableInSameFocusManager;
}, true);
exports.default = Text;
