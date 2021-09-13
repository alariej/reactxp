"use strict";
/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Button abstraction.
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
exports.Button = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var AppConfig_1 = require("../common/AppConfig");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Interfaces_1 = require("../common/Interfaces");
var Timers_1 = require("../common/utils/Timers");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var FocusManager_1 = require("./utils/FocusManager");
var Styles_1 = require("./Styles");
var UserInterface_1 = require("./UserInterface");
var _styles = {
    defaultButton: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center',
        appRegion: 'no-drag',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textAlign: 'left',
        borderWidth: '0',
    },
};
var _longPressTime = 1000;
var _defaultAccessibilityTrait = Interfaces_1.Types.AccessibilityTrait.Button;
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._mountedButton = null;
        _this._ignoreTouchEnd = false;
        _this._ignoreClick = false;
        _this._isMouseOver = false;
        _this._isFocusedWithKeyboard = false;
        _this._isHoverStarted = false;
        _this._onMount = function (ref) {
            _this._mountedButton = ref;
        };
        _this.onClick = function (e) {
            if (_this._ignoreClick) {
                e.stopPropagation();
                _this._ignoreClick = false;
            }
            else if (!_this.props.disabled && _this.props.onPress) {
                _this.props.onPress(e);
            }
        };
        _this._onContextMenu = function (e) {
            if (_this.props.onContextMenu) {
                _this.props.onContextMenu(e);
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.props.disabled) {
                return;
            }
            _this._isMouseOver = true;
            if (_this.props.onPressIn) {
                _this.props.onPressIn(e);
            }
            if (_this.props.onLongPress) {
                _this._lastMouseDownEvent = e;
                e.persist();
                // In the unlikely event we get 2 mouse down events, clear existing timer
                if (_this._longPressTimer) {
                    Timers_1.default.clearTimeout(_this._longPressTimer);
                }
                _this._longPressTimer = Timers_1.default.setTimeout(function () {
                    _this._longPressTimer = undefined;
                    if (_this.props.onLongPress) {
                        // lastMouseDownEvent can never be undefined at this point
                        _this.props.onLongPress(_this._lastMouseDownEvent);
                        if ('touches' in e) {
                            _this._ignoreTouchEnd = true;
                        }
                        else {
                            _this._ignoreClick = true;
                        }
                    }
                }, _this.props.delayLongPress || _longPressTime);
            }
        };
        _this._onTouchMove = function (e) {
            var buttonRect = e.target.getBoundingClientRect();
            var wasMouseOver = _this._isMouseOver;
            var isMouseOver = e.nativeEvent.touches[0].clientX > buttonRect.left &&
                e.nativeEvent.touches[0].clientX < buttonRect.right &&
                e.nativeEvent.touches[0].clientY > buttonRect.top &&
                e.nativeEvent.touches[0].clientY < buttonRect.bottom;
            // Touch has left the button, cancel the longpress handler.
            if (wasMouseOver && !isMouseOver) {
                if (_this._longPressTimer) {
                    clearTimeout(_this._longPressTimer);
                }
                if (_this.props.onHoverEnd) {
                    _this.props.onHoverEnd(e);
                }
            }
            _this._isMouseOver = isMouseOver;
        };
        _this._onMouseUp = function (e) {
            if (!_this.props.disabled && _this.props.onPressOut) {
                _this.props.onPressOut(e);
            }
            if (_this._longPressTimer) {
                Timers_1.default.clearTimeout(_this._longPressTimer);
            }
        };
        /**
         * Case where onPressOut is not triggered and the bubbling is canceled:
         * 1- Long press > release
         *
         * Cases where onPressOut is triggered:
         * 2- Long press > leave button > release touch
         * 3- Tap
         *
         * All other cases: onPressOut is not triggered and the bubbling is NOT canceled:
         */
        _this._onTouchEnd = function (e) {
            if (_this._isMouseOver && _this._ignoreTouchEnd) {
                /* 1 */
                e.stopPropagation();
            }
            else if (
            /* 2 */
            !_this._isMouseOver && _this._ignoreTouchEnd ||
                /* 3 */
                _this._isMouseOver && !_this._ignoreTouchEnd) {
                if ('touches' in e) {
                    // Stop the to event sequence to prevent trigger button.onMouseDown
                    e.preventDefault();
                    if (_this.props.onPress) {
                        _this.props.onPress(e);
                    }
                }
                if (_this.props.onPressOut) {
                    _this.props.onPressOut(e);
                }
            }
            _this._ignoreTouchEnd = false;
            if (_this._longPressTimer) {
                Timers_1.default.clearTimeout(_this._longPressTimer);
            }
        };
        _this._onMouseEnter = function (e) {
            _this._isMouseOver = true;
            _this._onHoverStart(e);
        };
        _this._onMouseLeave = function (e) {
            _this._isMouseOver = false;
            _this._onHoverEnd(e);
            // The mouse is still down. A long press may be just happened. Re-enable the next click.
            _this._ignoreClick = false;
            // Cancel longpress if mouse has left.
            if (_this._longPressTimer) {
                Timers_1.default.clearTimeout(_this._longPressTimer);
            }
        };
        // When we get focus on an element, show the hover effect on the element.
        // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
        _this._onFocus = function (e) {
            _this._isFocusedWithKeyboard = UserInterface_1.default.isNavigatingWithKeyboard();
            _this._onHoverStart(e);
            if (_this.props.onFocus) {
                _this.props.onFocus(e);
            }
        };
        _this._onBlur = function (e) {
            _this._isFocusedWithKeyboard = false;
            _this._onHoverEnd(e);
            if (_this.props.onBlur) {
                _this.props.onBlur(e);
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
        if (context && context.hasRxButtonAscendant) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.warn('Button components should not be embedded. Some APIs, e.g. Accessibility, will not work.');
            }
        }
        return _this;
    }
    Button.prototype.getChildContext = function () {
        return { hasRxButtonAscendant: true };
    };
    Button.prototype.render = function () {
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits, _defaultAccessibilityTrait);
        var ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        var ariaChecked = AccessibilityUtil_1.default.accessibilityTraitToAriaChecked(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        var ariaHasPopup = AccessibilityUtil_1.default.accessibilityTraitToAriaHasPopup(this.props.accessibilityTraits);
        // NOTE: We use tabIndex=0 to support focus.
        return (React.createElement("button", { ref: this._onMount, style: this._getStyles(), role: ariaRole, title: this.props.title, tabIndex: this.props.tabIndex, "aria-label": this.props.accessibilityLabel || this.props.title, "aria-disabled": this.props.disabled, "aria-hidden": isAriaHidden, "aria-selected": ariaSelected, "aria-checked": ariaChecked, onClick: this.onClick, onTouchStart: this._onMouseDown, onTouchMove: this._onTouchMove, onTouchEnd: this._onTouchEnd, onContextMenu: this._onContextMenu, onMouseDown: this._onMouseDown, onMouseUp: this._onMouseUp, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, onFocus: this._onFocus, onBlur: this._onBlur, onKeyDown: this.props.onKeyPress, disabled: this.props.disabled, "aria-haspopup": ariaHasPopup, "aria-controls": this.props.ariaControls, id: this.props.id, "data-test-id": this.props.testId }, this.props.children));
    };
    Button.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    Button.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._mountedButton !== null; });
    };
    Button.prototype.focus = function () {
        if (this._mountedButton) {
            this._mountedButton.focus();
        }
    };
    Button.prototype.blur = function () {
        if (this._mountedButton) {
            this._mountedButton.blur();
        }
    };
    Button.prototype._getStyles = function () {
        var buttonStyleMutations = {};
        var buttonStyles = Styles_1.default.combine(this.props.style);
        // Specify default style for padding only if padding is not already specified
        if (buttonStyles && buttonStyles.padding === undefined &&
            buttonStyles.paddingRight === undefined && buttonStyles.paddingLeft === undefined &&
            buttonStyles.paddingBottom === undefined && buttonStyles.paddingTop === undefined &&
            buttonStyles.paddingHorizontal === undefined && buttonStyles.paddingVertical === undefined) {
            buttonStyleMutations.padding = 0;
        }
        if (this.props.disabled) {
            buttonStyleMutations.opacity = this.props.disabledOpacity !== undefined ? this.props.disabledOpacity : 0.5;
        }
        // Default to 'pointer' cursor for enabled buttons unless otherwise specified.
        if (!buttonStyles || !buttonStyles.cursor) {
            buttonStyleMutations.cursor = this.props.disabled ? 'default' : 'pointer';
        }
        return Styles_1.default.combine([_styles.defaultButton, buttonStyles, buttonStyleMutations]);
    };
    Button.contextTypes = {
        hasRxButtonAscendant: PropTypes.bool,
        focusArbitrator: PropTypes.object,
    };
    Button.childContextTypes = {
        hasRxButtonAscendant: PropTypes.bool,
    };
    return Button;
}(Interfaces_1.Button));
exports.Button = Button;
(0, FocusManager_1.applyFocusableComponentMixin)(Button);
exports.default = Button;
