"use strict";
/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Text abstraction.
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
var React = require("react");
var RN = require("react-native");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var EventHelpers_1 = require("./utils/EventHelpers");
var lodashMini_1 = require("./utils/lodashMini");
var Styles_1 = require("./Styles");
var _styles = {
    defaultText: Styles_1.default.createTextStyle({
        overflow: 'hidden',
    }),
};
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onMount = function (component) {
            _this._mountedComponent = component || undefined;
        };
        _this._onPress = function (e) {
            if (EventHelpers_1.default.isRightMouseButton(e)) {
                if (_this.props.onContextMenu) {
                    _this.props.onContextMenu(EventHelpers_1.default.toMouseEvent(e));
                }
            }
            else {
                if (_this.props.onPress) {
                    _this.props.onPress(EventHelpers_1.default.toMouseEvent(e));
                }
            }
        };
        return _this;
    }
    // To be able to use Text inside TouchableHighlight/TouchableOpacity
    Text.prototype.setNativeProps = function (nativeProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    };
    Text.prototype.render = function () {
        // The presence of any of the onPress or onContextMenu makes the RN.Text a potential touch responder
        var onPress = (this.props.onPress || this.props.onContextMenu) ? this._onPress : undefined;
        var importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility);
        var extendedProps = this._getExtendedProperties();
        return (React.createElement(RN.Text, __assign({ style: this._getStyles(), ref: this._onMount, importantForAccessibility: importantForAccessibility, numberOfLines: this.props.numberOfLines, allowFontScaling: this.props.allowFontScaling, onPress: onPress, selectable: this.props.selectable, textBreakStrategy: 'simple', ellipsizeMode: this.props.ellipsizeMode, testID: this.props.testId }, extendedProps), this.props.children));
    };
    Text.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    Text.prototype._getExtendedProperties = function () {
        var onContextMenu = this.props.onContextMenu;
        // The presence of an onContextMenu on this instance or on the first responder parent up the tree
        // should disable any system provided context menu
        var disableContextMenu = !!onContextMenu || !!this.context.isRxParentAContextMenuResponder;
        return { disableContextMenu: disableContextMenu };
    };
    Text.prototype.getChildContext = function () {
        // Let descendant RX components know that their nearest RX ancestor is an RX.Text.
        // Because they're in an RX.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    };
    Text.prototype._getStyles = function () {
        return lodashMini_1.compact([_styles.defaultText, this.props.style]);
    };
    Text.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return !!_this._mountedComponent; });
    };
    Text.prototype.focus = function () {
        if (this._mountedComponent) {
            AccessibilityUtil_1.default.setAccessibilityFocus(this);
        }
        if (this._mountedComponent && this._mountedComponent.focus) {
            this._mountedComponent.focus();
        }
    };
    Text.prototype.blur = function () {
        if (this._mountedComponent && this._mountedComponent.blur) {
            this._mountedComponent.blur();
        }
    };
    Text.prototype.getSelectedText = function () {
        return ''; // Implemented for 'windows' only (requires support from RN).
    };
    Text.contextTypes = {
        focusArbitrator: PropTypes.object,
        isRxParentAContextMenuResponder: PropTypes.bool,
    };
    Text.childContextTypes = {
        isRxParentAText: PropTypes.bool.isRequired,
    };
    return Text;
}(React.Component));
exports.Text = Text;
exports.default = Text;
