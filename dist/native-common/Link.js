"use strict";
/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Link abstraction.
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
exports.Link = exports.LinkBase = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var RN = require("react-native");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Linking_1 = require("../native-common/Linking");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var EventHelpers_1 = require("./utils/EventHelpers");
var LinkBase = /** @class */ (function (_super) {
    __extends(LinkBase, _super);
    function LinkBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isMounted = false;
        _this._onMount = function (component) {
            _this._mountedComponent = component || undefined;
        };
        _this._onPress = function (e) {
            if (EventHelpers_1.default.isRightMouseButton(e)) {
                if (_this.props.onContextMenu) {
                    _this.props.onContextMenu(EventHelpers_1.default.toMouseEvent(e));
                }
                return;
            }
            if (_this.props.onPress) {
                _this.props.onPress(EventHelpers_1.default.toMouseEvent(e), _this.props.url);
                return;
            }
            // The default action is to launch a browser.
            if (_this.props.url) {
                Linking_1.default.openUrl(_this.props.url).catch(function (err) {
                    // Catch the exception so it doesn't propagate.
                });
            }
        };
        _this._onLongPress = function (e) {
            // Right mouse button doesn't change behavior based on press length.
            if (EventHelpers_1.default.isRightMouseButton(e)) {
                if (_this.props.onContextMenu) {
                    _this.props.onContextMenu(EventHelpers_1.default.toMouseEvent(e));
                }
                return;
            }
            if (!EventHelpers_1.default.isRightMouseButton(e) && _this.props.onLongPress) {
                _this.props.onLongPress(EventHelpers_1.default.toMouseEvent(e), _this.props.url);
            }
        };
        return _this;
    }
    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    LinkBase.prototype.setNativeProps = function (nativeProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    };
    LinkBase.prototype.render = function () {
        var internalProps = {
            style: this.props.style,
            numberOfLines: this.props.numberOfLines === 0 ? undefined : this.props.numberOfLines,
            onPress: this._onPress,
            onLongPress: this._onLongPress,
            allowFontScaling: this.props.allowFontScaling,
            children: this.props.children,
            tooltip: this.props.title,
            testID: this.props.testId,
        };
        return this._render(internalProps, this._onMount);
    };
    LinkBase.prototype.componentDidMount = function () {
        this._isMounted = true;
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    LinkBase.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    LinkBase.prototype._render = function (internalProps, onMount) {
        return (React.createElement(RN.Text, __assign({}, internalProps, { ref: onMount })));
    };
    LinkBase.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return !!_this._mountedComponent; });
    };
    LinkBase.prototype.focus = function () {
        if (this._mountedComponent) {
            AccessibilityUtil_1.default.setAccessibilityFocus(this);
        }
        if (this._mountedComponent && this._mountedComponent.focus) {
            this._mountedComponent.focus();
        }
    };
    LinkBase.prototype.blur = function () {
        if (this._mountedComponent && this._mountedComponent.blur) {
            this._mountedComponent.blur();
        }
    };
    LinkBase.contextTypes = {
        focusArbitrator: PropTypes.object,
        isRxParentAText: PropTypes.bool,
    };
    return LinkBase;
}(React.Component));
exports.LinkBase = LinkBase;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Link;
}(LinkBase));
exports.Link = Link;
exports.default = Link;
