"use strict";
/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Button abstraction.
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
exports.Button = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var RN = require("react-native");
var RNW = require("react-native-windows");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var assert_1 = require("../common/assert");
var Button_1 = require("../native-common/Button");
var EventHelpers_1 = require("../native-common/utils/EventHelpers");
var FocusManager_1 = require("../native-desktop/utils/FocusManager");
var Interfaces_1 = require("../common/Interfaces");
var UserInterface_1 = require("../native-common/UserInterface");
var KEY_CODE_ENTER = 13;
var KEY_CODE_SPACE = 32;
var KEY_CODE_F10 = 121;
var KEY_CODE_APP = 500;
var DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER, KEY_CODE_F10, KEY_CODE_APP];
var UP_KEYCODES = [KEY_CODE_SPACE];
var FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isFocusedWithKeyboard = false;
        _this._onAccessibilityTap = function (e) {
            if (!_this.props.disabled && _this.props.onPress) {
                _this.props.onPress(e);
            }
        };
        _this._onKeyDown = function (e) {
            if (!_this.props.disabled) {
                var keyEvent_1 = EventHelpers_1.default.toKeyboardEvent(e);
                if (_this.props.onKeyPress) {
                    _this.props.onKeyPress(keyEvent_1);
                }
                if (_this.props.onPress) {
                    var key = keyEvent_1.keyCode;
                    // ENTER triggers press on key down
                    if (key === KEY_CODE_ENTER) {
                        _this.props.onPress(keyEvent_1);
                    }
                }
                if (_this.props.onContextMenu) {
                    var key = keyEvent_1.keyCode;
                    if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent_1.shiftKey)) {
                        if (_this._isMounted) {
                            UserInterface_1.default.measureLayoutRelativeToWindow(_this).then(function (layoutInfo) {
                                // need to simulate the mouse event so that we
                                // can show the context menu in the right position
                                if (_this._isMounted) {
                                    var mouseEvent = EventHelpers_1.default.keyboardToMouseEvent(keyEvent_1, layoutInfo, _this._getContextMenuOffset());
                                    if (_this.props.onContextMenu) {
                                        _this.props.onContextMenu(mouseEvent);
                                    }
                                }
                            }).catch(function (e) {
                                console.warn('Button measureKayoutRelativeToWindow exception: ' + JSON.stringify(e));
                            });
                        }
                    }
                }
            }
        };
        _this._onKeyUp = function (e) {
            var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
            if (keyEvent.keyCode === KEY_CODE_SPACE && !_this.props.disabled && _this.props.onPress) {
                _this.props.onPress(keyEvent);
            }
        };
        // When we get focus on an element, show the hover effect on the element.
        // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
        _this._onFocus = function (e) {
            if (e.currentTarget === e.target) {
                _this.onFocus();
            }
            _this._isFocusedWithKeyboard = UserInterface_1.default.isNavigatingWithKeyboard();
            _this._onHoverStart(e);
            if (_this.props.onFocus) {
                _this.props.onFocus(EventHelpers_1.default.toFocusEvent(e));
            }
        };
        _this._onBlur = function (e) {
            _this._isFocusedWithKeyboard = false;
            _this._onHoverEnd(e);
            if (_this.props.onBlur) {
                _this.props.onBlur(EventHelpers_1.default.toFocusEvent(e));
            }
        };
        _this._onHoverStart = function (e) {
            if (!_this._isHoverStarted && (_this._isMouseOver || _this._isFocusedWithKeyboard)) {
                _this._isHoverStarted = true;
                if (_this.props.onHoverStart) {
                    _this.props.onHoverStart(e);
                }
            }
        };
        _this._onHoverEnd = function (e) {
            if (_this._isHoverStarted && !_this._isMouseOver && !_this._isFocusedWithKeyboard) {
                _this._isHoverStarted = false;
                if (_this.props.onHoverEnd) {
                    _this.props.onHoverEnd(e);
                }
            }
        };
        return _this;
    }
    // Offset to show context menu using keyboard.
    Button.prototype._getContextMenuOffset = function () {
        return { x: 0, y: 0 };
    };
    Button.prototype._render = function (internalProps, onMount) {
        // RNW.FocusableProps tabIndex: default is 0.
        // -1 has no special semantic similar to DOM.
        var tabIndex = this.getTabIndex();
        // RNW.FocusableProps windowsTabFocusable:
        // - true: keyboard focusable through any mean, receives keyboard input
        // - false: not focusable at all, doesn't receive keyboard input
        // The intermediate "focusable, but not in the tab order" case is not supported.
        var windowsTabFocusable = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;
        var importantForAccessibility = this.getImportantForAccessibility();
        // We don't use 'string' ref type inside ReactXP
        var originalRef = internalProps.ref;
        (0, assert_1.default)(!(typeof originalRef === 'string'), 'Button: ReactXP must not use string refs internally');
        var componentRef = originalRef;
        var focusableViewProps = __assign(__assign({}, internalProps), { ref: onMount, componentRef: componentRef, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, isTabStop: windowsTabFocusable, tabIndex: tabIndex, importantForAccessibility: importantForAccessibility, disableSystemFocusVisuals: false, handledKeyDownKeys: DOWN_KEYCODES, handledKeyUpKeys: UP_KEYCODES, onKeyDown: this._onKeyDown, onKeyUp: this._onKeyUp, onFocus: this._onFocus, onBlur: this._onBlur, onAccessibilityTap: this._onAccessibilityTap });
        return (React.createElement(FocusableAnimatedView, __assign({}, focusableViewProps), this.props.children));
    };
    Button.prototype.focus = function () {
        if (this._buttonElement && this._buttonElement.focus) {
            this._buttonElement.focus();
        }
    };
    Button.prototype.blur = function () {
        if (this._buttonElement && this._buttonElement.blur) {
            this._buttonElement.blur();
        }
    };
    Button.prototype.setNativeProps = function (nativeProps) {
        // Redirect to focusable component if present.
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
        else {
            _super.prototype.setNativeProps.call(this, nativeProps);
        }
    };
    Button.prototype.getChildContext = function () {
        var childContext = _super.prototype.getChildContext.call(this);
        // We use a context field to signal any component in the subtree to disable any system provided context menus.
        // This is not a bulletproof mechanism, context changes not being guaranteed to be detected by children, depending on factors
        // like shouldComponentUpdate methods on intermediate nodes, etc.
        // Fortunately press handlers are pretty stable.
        // This instance can be a responder (even when button is disabled). It may or may not have to invoke an onContextMenu handler, but
        // it will consume all corresponding touch events, so overwriting any parent-set value is the correct thing to do.
        childContext.isRxParentAContextMenuResponder = !!this.props.onContextMenu;
        // This button will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
        // (more detailed description is in windows/View.tsx)
        childContext.isRxParentAFocusableInSameFocusManager = true;
        return childContext;
    };
    // From FocusManagerFocusableComponent interface
    //
    Button.prototype.onFocus = function () {
        // Focus Manager hook
    };
    Button.prototype.getTabIndex = function () {
        // Button defaults to a tabIndex of 0
        // Focus Manager may override this
        return this.props.tabIndex || 0;
    };
    Button.prototype.getImportantForAccessibility = function () {
        // Focus Manager may override this
        // We force a default of YES if no property is provided, consistent with the base class
        return AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, Interfaces_1.Types.ImportantForAccessibility.Yes);
    };
    Button.prototype.updateNativeAccessibilityProps = function () {
        if (this._buttonElement) {
            var tabIndex = this.getTabIndex();
            var windowsTabFocusable = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;
            var importantForAccessibility = this.getImportantForAccessibility();
            this._buttonElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable,
                importantForAccessibility: importantForAccessibility,
            });
        }
    };
    Button.childContextTypes = __assign({ isRxParentAContextMenuResponder: PropTypes.bool, isRxParentAFocusableInSameFocusManager: PropTypes.bool }, Button_1.Button.childContextTypes);
    return Button;
}(Button_1.Button));
exports.Button = Button;
(0, FocusManager_1.applyFocusableComponentMixin)(Button);
exports.default = Button;
