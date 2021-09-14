"use strict";
/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Button abstraction.
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
var App_1 = require("../native-common/App");
var AppConfig_1 = require("../common/AppConfig");
var assert_1 = require("../common/assert");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Interfaces_1 = require("../common/Interfaces");
var Timers_1 = require("../common/utils/Timers");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Animated_1 = require("./Animated");
var EventHelpers_1 = require("./utils/EventHelpers");
var Platform_1 = require("./Platform");
var Styles_1 = require("./Styles");
var UserInterface_1 = require("./UserInterface");
var _styles = {
    defaultButton: Styles_1.default.createButtonStyle({
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    }),
    disabled: Styles_1.default.createButtonStyle({
        opacity: 0.5,
    }),
};
var _isNativeMacOs = Platform_1.default.getType() === 'macos';
var _defaultImportantForAccessibility = Interfaces_1.Types.ImportantForAccessibility.Yes;
var _defaultActiveOpacity = 0.2;
var _inactiveOpacityAnimationDuration = 250;
var _activeOpacityAnimationDuration = 0;
var _hideUnderlayTimeout = 100;
var _underlayInactive = 'transparent';
function noop() { }
function applyMixin(thisObj, mixin, propertiesToSkip) {
    Object.getOwnPropertyNames(mixin).forEach(function (name) {
        if (name !== 'constructor' && propertiesToSkip.indexOf(name) === -1 && typeof mixin[name].bind === 'function') {
            (0, assert_1.default)(!(name in thisObj), "An object cannot have a method with the same name as one of its mixins: \"" + name + "\"");
            thisObj[name] = mixin[name].bind(thisObj);
        }
    });
}
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props, context) {
        var _this = _super.call(this, props, context) || this;
        // @ts-ignore
        _this._mixin_componentDidMount = RN.Touchable.Mixin.componentDidMount || noop;
        // @ts-ignore
        _this._mixin_componentWillUnmount = RN.Touchable.Mixin.componentWillUnmount || noop;
        _this._isMounted = false;
        _this._isMouseOver = false;
        _this._isHoverStarted = false;
        _this.touchableHandleActivePressIn = function (e) {
            if (_this._isTouchFeedbackApplicable()) {
                if (_this.props.underlayColor) {
                    if (_this._hideTimeout) {
                        Timers_1.default.clearTimeout(_this._hideTimeout);
                        _this._hideTimeout = undefined;
                    }
                    _this._showUnderlay();
                }
                // We do not want to animate opacity if underlayColour is provided. Unless an explicit activeOpacity is provided
                if (!_this.props.disableTouchOpacityAnimation && (_this.props.activeOpacity || !_this.props.underlayColor)) {
                    _this._opacityActive(_activeOpacityAnimationDuration);
                }
            }
            if (!_this.props.disabled && _this.props.onPressIn) {
                _this.props.onPressIn(e);
            }
        };
        _this.touchableHandleActivePressOut = function (e) {
            if (_this._isTouchFeedbackApplicable()) {
                if (_this.props.underlayColor) {
                    if (_this._hideTimeout) {
                        Timers_1.default.clearTimeout(_this._hideTimeout);
                    }
                    _this._hideTimeout = Timers_1.default.setTimeout(_this._hideUnderlay, _hideUnderlayTimeout);
                }
                if (!_this.props.disableTouchOpacityAnimation && (_this.props.activeOpacity || !_this.props.underlayColor)) {
                    _this._opacityInactive(_inactiveOpacityAnimationDuration);
                }
            }
            if (!_this.props.disabled && _this.props.onPressOut) {
                _this.props.onPressOut(e);
            }
        };
        _this.touchableHandlePress = function (e) {
            UserInterface_1.default.evaluateTouchLatency(e);
            if (!_this.props.disabled) {
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
            }
        };
        _this.touchableHandleLongPress = function (e) {
            if (!_this.props.disabled && !EventHelpers_1.default.isRightMouseButton(e) && _this.props.onLongPress) {
                _this.props.onLongPress(EventHelpers_1.default.toMouseEvent(e));
            }
        };
        _this.touchableGetHighlightDelayMS = function () { return 20; };
        _this.touchableGetPressRectOffset = function () { return ({ top: 20, left: 20, right: 20, bottom: 100 }); };
        _this._onMount = function (btn) {
            _this._buttonElement = btn || undefined;
        };
        _this._onMouseEnter = function (e) {
            _this._isMouseOver = true;
            _this._onHoverStart(e);
        };
        _this._onMouseLeave = function (e) {
            _this._isMouseOver = false;
            _this._onHoverEnd(e);
        };
        _this._onHoverStart = function (e) {
            if (!_this._isHoverStarted && _this._isMouseOver) {
                _this._isHoverStarted = true;
                if (_this.props.onHoverStart) {
                    _this.props.onHoverStart(e);
                }
            }
        };
        _this._onHoverEnd = function (e) {
            if (_this._isHoverStarted && !_this._isMouseOver) {
                _this._isHoverStarted = false;
                if (_this.props.onHoverEnd) {
                    _this.props.onHoverEnd(e);
                }
            }
        };
        _this._hideUnderlay = function () {
            if (!_this._isMounted || !_this._buttonElement) {
                return;
            }
            _this._buttonElement.setNativeProps({
                style: [{
                        backgroundColor: _underlayInactive,
                    }, _this.props.style],
            });
        };
        // @ts-ignore
        applyMixin(_this, RN.Touchable.Mixin, [
            // Properties that Button and RN.Touchable.Mixin have in common. Button needs
            // to dispatch these methods to RN.Touchable.Mixin manually.
            'componentDidMount',
            'componentWillUnmount',
        ]);
        _this.state = _this.touchableGetInitialState();
        _this._setOpacityStyles(props);
        if (context && context.hasRxButtonAscendant) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.warn('Button components should not be embedded. Some APIs, e.g. Accessibility, will not work.');
            }
        }
        return _this;
    }
    Button.prototype._render = function (internalProps, onMount) {
        return (React.createElement(RN.Animated.View, __assign({}, internalProps, { ref: onMount }), this.props.children));
    };
    Button.prototype.render = function () {
        // Accessibility props.
        var importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility, _defaultImportantForAccessibility);
        var opacityStyle = this.props.disableTouchOpacityAnimation ? undefined : this._opacityAnimatedStyle;
        var disabledStyle = this.props.disabled ? _styles.disabled : undefined;
        if (this.props.disabled && this.props.disabledOpacity !== undefined) {
            disabledStyle = Styles_1.default.createButtonStyle({
                opacity: this.props.disabledOpacity,
            }, false);
        }
        var extendedProps = {
            onAccessibilityTapIOS: this.props.onAccessibilityTapIOS,
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            tooltip: this.props.title,
            style: Styles_1.default.combine([_styles.defaultButton, this.props.style, opacityStyle,
                disabledStyle]),
            accessibilityLabel: this.props.accessibilityLabel || this.props.title,
            importantForAccessibility: importantForAccessibility,
            onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
            onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
            onResponderGrant: this.touchableHandleResponderGrant,
            onResponderMove: this.touchableHandleResponderMove,
            onResponderRelease: this.touchableHandleResponderRelease,
            onResponderTerminate: this.touchableHandleResponderTerminate,
            shouldRasterizeIOS: this.props.shouldRasterizeIOS,
            testID: this.props.testId,
        };
        // Mac RN requires some addition props for button accessibility
        if (_isNativeMacOs && App_1.default.supportsExperimentalKeyboardNavigation && this.props.onPress) {
            // Cast to the object that mac expects to indirectly mutate extendedProps
            var macExtendedProps = extendedProps;
            macExtendedProps.onClick = this.touchableHandlePress;
            // Negative tabIndex prevents keyboard focus
            if (this.props.tabIndex === undefined || this.props.tabIndex >= 0) {
                macExtendedProps.acceptsKeyboardFocus = true;
                macExtendedProps.enableFocusRing = true;
            }
        }
        return this._render(extendedProps, this._onMount);
    };
    Button.prototype.componentDidMount = function () {
        this._mixin_componentDidMount();
        this._isMounted = true;
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    Button.prototype.componentWillUnmount = function () {
        this._mixin_componentWillUnmount();
        this._isMounted = false;
    };
    Button.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        // If opacity styles were updated as a part of props update, we need to reflect that in the opacity animation value
        this._setOpacityStyles(nextProps, this.props);
    };
    Button.prototype.getChildContext = function () {
        return { hasRxButtonAscendant: true };
    };
    Button.prototype.setNativeProps = function (nativeProps) {
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        }
    };
    Button.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._isMounted; });
    };
    Button.prototype.blur = function () {
        if (this._buttonElement && this._buttonElement.blur) {
            this._buttonElement.blur();
        }
    };
    Button.prototype.focus = function () {
        if (this._isMounted) {
            AccessibilityUtil_1.default.setAccessibilityFocus(this);
        }
        if (this._buttonElement && this._buttonElement.focus) {
            this._buttonElement.focus();
        }
    };
    Button.prototype._setOpacityStyles = function (props, prevProps) {
        var opacityValueFromProps = this._getDefaultOpacityValue(props.style);
        if (this._defaultOpacityValue !== opacityValueFromProps || (prevProps && props.disabled !== prevProps.disabled)) {
            this._defaultOpacityValue = opacityValueFromProps;
            this._opacityAnimatedValue = new Animated_1.default.Value(this._defaultOpacityValue);
            this._opacityAnimatedStyle = Styles_1.default.createAnimatedViewStyle({
                opacity: this._opacityAnimatedValue,
            });
        }
    };
    Button.prototype._isTouchFeedbackApplicable = function () {
        return this._isMounted && this._hasPressHandler() && this._buttonElement;
    };
    Button.prototype._opacityActive = function (duration) {
        this.setOpacityTo(this.props.activeOpacity || _defaultActiveOpacity, duration);
    };
    Button.prototype._opacityInactive = function (duration) {
        this.setOpacityTo(this._defaultOpacityValue, duration);
    };
    Button.prototype._getDefaultOpacityValue = function (style) {
        var flattenedStyles;
        if (style) {
            flattenedStyles = RN.StyleSheet.flatten(style);
        }
        return flattenedStyles && flattenedStyles.opacity || 1;
    };
    /**
    * Animate the touchable to a new opacity.
    */
    Button.prototype.setOpacityTo = function (value, duration) {
        Animated_1.default.timing(this._opacityAnimatedValue, {
            toValue: value,
            duration: duration,
            easing: Animated_1.default.Easing.InOut(),
            useNativeDriver: true,
        }).start();
    };
    Button.prototype._hasPressHandler = function () {
        return !!(this.props.onPress ||
            this.props.onPressIn ||
            this.props.onPressOut ||
            this.props.onLongPress);
    };
    Button.prototype._showUnderlay = function () {
        if (!this._buttonElement) {
            return;
        }
        this._buttonElement.setNativeProps({
            style: {
                backgroundColor: this.props.underlayColor,
            },
        });
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
exports.default = Button;
