"use strict";
/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Desktop-specific implementation of the cross-platform Link abstraction.
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
exports.Link = void 0;
var React = require("react");
var RN = require("react-native");
var RNW = require("react-native-windows");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var assert_1 = require("../common/assert");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var EventHelpers_1 = require("../native-common/utils/EventHelpers");
var FocusManager_1 = require("../native-desktop/utils/FocusManager");
var Interfaces_1 = require("../common/Interfaces");
var Link_1 = require("../native-common/Link");
var UserInterface_1 = require("../native-common/UserInterface");
var KEY_CODE_ENTER = 13;
var KEY_CODE_SPACE = 32;
var KEY_CODE_F10 = 121;
var KEY_CODE_APP = 500;
var DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER, KEY_CODE_APP, KEY_CODE_F10];
var UP_KEYCODES = [KEY_CODE_SPACE];
var FocusableText = RNW.createFocusableComponent(RN.Text);
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link(props) {
        var _this = _super.call(this, props) || this;
        _this._restrictedOrLimitedCallback = function (restrictedOrLimited) {
            _this.setState({
                isRestrictedOrLimited: restrictedOrLimited,
            });
        };
        _this._focusableElement = null;
        _this._onFocusableRef = function (btn) {
            _this._focusableElement = btn;
        };
        _this._nativeHyperlinkElement = null;
        _this._onNativeHyperlinkRef = function (ref) {
            _this._nativeHyperlinkElement = ref;
        };
        _this._onKeyDown = function (e) {
            var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
            var key = keyEvent.keyCode;
            // ENTER triggers press on key down
            if (key === KEY_CODE_ENTER) {
                // Defer to base class
                _this._onPress(keyEvent);
            }
            if (_this.props.onContextMenu) {
                var key_1 = keyEvent.keyCode;
                if ((key_1 === KEY_CODE_APP) || (key_1 === KEY_CODE_F10 && keyEvent.shiftKey)) {
                    if (_this._isMounted) {
                        UserInterface_1.default.measureLayoutRelativeToWindow(_this).then(function (layoutInfo) {
                            // need to simulate the mouse event so that we
                            // can show the context menu in the right position
                            if (_this._isMounted) {
                                var mouseEvent = EventHelpers_1.default.keyboardToMouseEvent(keyEvent, layoutInfo, _this._getContextMenuOffset());
                                if (_this.props.onContextMenu) {
                                    _this.props.onContextMenu(mouseEvent);
                                }
                            }
                        }).catch(function (e) {
                            console.warn('Link measureKayoutRelativeToWindow exception: ' + JSON.stringify(e));
                        });
                    }
                }
            }
        };
        _this._onKeyUp = function (e) {
            var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
            if (keyEvent.keyCode === KEY_CODE_SPACE) {
                // Defer to base class
                _this._onPress(keyEvent);
            }
        };
        _this._onFocus = function (e) {
            if (e.currentTarget === e.target) {
                _this.onFocus();
            }
        };
        _this.state = {
            isRestrictedOrLimited: false,
        };
        return _this;
    }
    // Offset to show context menu using keyboard.
    Link.prototype._getContextMenuOffset = function () {
        return { x: 0, y: 0 };
    };
    Link.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        // Retrieve focus restriction state and subscribe for further changes.
        // This is the earliest point this can be done since Focus Manager uses a pre-"componentDidMount" hook
        // to connect to component instances
        this._restrictedOrLimitedCallback(FocusManager_1.FocusManager.isComponentFocusRestrictedOrLimited(this));
        FocusManager_1.FocusManager.subscribe(this, this._restrictedOrLimitedCallback);
    };
    Link.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        // This is for symmetry, but the callbacks have already been deleted by FocusManager since its
        // hook executes first
        FocusManager_1.FocusManager.unsubscribe(this, this._restrictedOrLimitedCallback);
    };
    Link.prototype._render = function (internalProps, onMount) {
        if (this.context && !this.context.isRxParentAText) {
            // Standalone link. We use a keyboard focusable RN.Text
            return this._renderLinkAsFocusableText(internalProps, onMount);
        }
        else if (RNW.HyperlinkWindows && !this.state.isRestrictedOrLimited) {
            // Inline Link. We use a native Hyperlink inline if RN supports it and element is not "focus restricted/limited"
            return this._renderLinkAsNativeHyperlink(internalProps);
        }
        else {
            // Inline Link. We defer to base class (that uses a plain RN.Text) for the rest of the cases.
            return _super.prototype._render.call(this, internalProps, onMount);
        }
    };
    Link.prototype._renderLinkAsFocusableText = function (internalProps, onMount) {
        var focusableTextProps = this._createFocusableTextProps(internalProps);
        return (React.createElement(FocusableText, __assign({}, focusableTextProps, { ref: onMount })));
    };
    Link.prototype._createFocusableTextProps = function (internalProps) {
        var tabIndex = this.getTabIndex();
        var windowsTabFocusable = tabIndex !== undefined && tabIndex >= 0;
        var importantForAccessibility = this.getImportantForAccessibility();
        // We don't use 'string' ref type inside ReactXP
        var originalRef = internalProps.ref;
        assert_1.default(!(typeof originalRef === 'string'), 'Link: ReactXP must not use string refs internally');
        var componentRef = originalRef;
        var focusableTextProps = __assign(__assign({}, internalProps), { componentRef: componentRef, ref: this._onFocusableRef, isTabStop: windowsTabFocusable, tabIndex: tabIndex, importantForAccessibility: importantForAccessibility, disableSystemFocusVisuals: false, handledKeyDownKeys: DOWN_KEYCODES, handledKeyUpKeys: UP_KEYCODES, onKeyDown: this._onKeyDown, onKeyUp: this._onKeyUp, onFocus: this._onFocus, onAccessibilityTap: this._onPress });
        return focusableTextProps;
    };
    Link.prototype._renderLinkAsNativeHyperlink = function (internalProps) {
        // We don't use 'string' ref type inside ReactXP
        var originalRef = internalProps.ref;
        assert_1.default(!(typeof originalRef === 'string'), 'Link: ReactXP must not use string refs internally');
        return (React.createElement(RNW.HyperlinkWindows, __assign({}, internalProps, { ref: this._onNativeHyperlinkRef, onFocus: this._onFocus })));
    };
    Link.prototype.focus = function () {
        if (this._focusableElement && this._focusableElement.focus) {
            this._focusableElement.focus();
        }
        else if (this._nativeHyperlinkElement && this._nativeHyperlinkElement.focus) {
            this._nativeHyperlinkElement.focus();
        }
    };
    Link.prototype.blur = function () {
        if (this._focusableElement && this._focusableElement.blur) {
            this._focusableElement.blur();
        }
        else if (this._nativeHyperlinkElement && this._nativeHyperlinkElement.blur) {
            this._nativeHyperlinkElement.blur();
        }
    };
    Link.prototype.setNativeProps = function (nativeProps) {
        // Redirect to focusable component if present.
        if (this._focusableElement) {
            this._focusableElement.setNativeProps(nativeProps);
        }
        else {
            _super.prototype.setNativeProps.call(this, nativeProps);
        }
    };
    Link.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { _this.focus(); }, function () { return _this._isAvailableToFocus(); });
    };
    Link.prototype._isAvailableToFocus = function () {
        return !!((this._focusableElement && this._focusableElement.focus) ||
            (this._nativeHyperlinkElement && this._nativeHyperlinkElement.focus));
    };
    // From FocusManagerFocusableComponent interface
    //
    Link.prototype.onFocus = function () {
        // Focus Manager hook
    };
    Link.prototype.getTabIndex = function () {
        // Link defaults to a tabIndex of 0
        // Focus Manager may override this
        return this.props.tabIndex || 0;
    };
    Link.prototype.getImportantForAccessibility = function () {
        // Focus Manager may override this
        // Go by default of Auto, LinkProps has no corresponding accessibility property
        return AccessibilityUtil_1.default.importantForAccessibilityToString(Interfaces_1.Types.ImportantForAccessibility.Auto);
    };
    Link.prototype.updateNativeAccessibilityProps = function () {
        if (this._focusableElement) {
            var tabIndex = this.getTabIndex();
            var windowsTabFocusable = tabIndex !== undefined && tabIndex >= 0;
            var importantForAccessibility = this.getImportantForAccessibility();
            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable,
                importantForAccessibility: importantForAccessibility,
            });
        }
    };
    return Link;
}(Link_1.LinkBase));
exports.Link = Link;
FocusManager_1.applyFocusableComponentMixin(Link);
exports.default = Link;
