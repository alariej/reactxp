"use strict";
/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
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
exports.View = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var RN = require("react-native");
var assert_1 = require("../common/assert");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Timers_1 = require("../common/utils/Timers");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Animated_1 = require("./Animated");
var App_1 = require("./App");
var EventHelpers_1 = require("./utils/EventHelpers");
var lodashMini_1 = require("./utils/lodashMini");
var Platform_1 = require("./Platform");
var Styles_1 = require("./Styles");
var UserInterface_1 = require("./UserInterface");
var ViewBase_1 = require("./ViewBase");
var _isNativeMacOs = Platform_1.default.getType() === 'macos';
var LayoutAnimation = RN.LayoutAnimation;
// Note: a lot of code is duplicated with Button due to View currently supporting a lot of features Button does.
var _defaultActiveOpacity = 0.2;
var _inactiveOpacityAnimationDuration = 250;
var _activeOpacityAnimationDuration = 0;
var _hideUnderlayTimeout = 100;
var _underlayInactive = 'transparent';
var safeInsetsStyle = Styles_1.default.createViewStyle({ flex: 1, alignSelf: 'stretch' });
function noop() { }
function applyMixin(thisObj, mixin, propertiesToSkip) {
    Object.getOwnPropertyNames(mixin).forEach(function (name) {
        if (name !== 'constructor' && propertiesToSkip.indexOf(name) === -1 && typeof mixin[name].bind === 'function') {
            (0, assert_1.default)(!(name in thisObj), "An object cannot have a method with the same name as one of its mixins: \"".concat(name, "\""));
            thisObj[name] = mixin[name].bind(thisObj);
        }
    });
}
function removeMixin(thisObj, mixin, propertiesToSkip) {
    Object.getOwnPropertyNames(mixin).forEach(function (name) {
        if (name !== 'constructor' && propertiesToSkip.indexOf(name) === -1) {
            (0, assert_1.default)((name in thisObj), "An object is missing a mixin method: \"".concat(name, "\""));
            delete thisObj[name];
        }
    });
}
function extractChildrenKeys(children) {
    var keys = [];
    React.Children.forEach(children, function (child, index) {
        if (child) {
            var childReactElement = child;
            (0, assert_1.default)(childReactElement.key !== undefined && childReactElement.key !== null, 'Children passed to a `View` with child animations enabled must have a `key`');
            if (childReactElement.key !== null) {
                keys.push(childReactElement.key);
            }
        }
    });
    return keys;
}
function findInvalidRefs(children) {
    var invalidRefs = [];
    React.Children.forEach(children, function (child) {
        if (child) {
            var childElement = child;
            if (typeof childElement.ref !== 'function' && childElement.ref !== undefined && childElement.ref !== null) {
                invalidRefs.push(childElement.ref);
            }
        }
    });
    return invalidRefs;
}
// Returns true if an item was added or moved. We use this information to determine
// whether or not we'll need to play any list edit animations.
function _childrenEdited(prevChildrenKeys, nextChildrenKeys) {
    var prevLength = prevChildrenKeys ? prevChildrenKeys.length : 0;
    var nextLength = nextChildrenKeys ? nextChildrenKeys.length : 0;
    // Were new items added?
    if (nextLength > prevLength) {
        return true;
    }
    // See if changes were limited to removals. Any additions or moves should return true.
    var prevIndex = 0;
    for (var nextIndex = 0; nextIndex < nextLength; nextIndex++) {
        if (prevChildrenKeys[prevIndex] === nextChildrenKeys[nextIndex]) {
            prevIndex++;
        }
        else {
            // If there are more "next" items left than there are "prev" items left,
            // then we know that something has been added or moved.
            if (nextLength - nextIndex > prevLength - prevIndex) {
                return true;
            }
        }
    }
    return false;
}
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._internalProps = {};
        _this._mixinIsApplied = false;
        _this._isMounted = false;
        _this._onKeyPress = function (e) {
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(EventHelpers_1.default.toKeyboardEvent(e));
            }
        };
        _this._hideUnderlay = function () {
            if (!_this._isMounted || !_this._nativeComponent) {
                return;
            }
            _this._nativeComponent.setNativeProps({
                style: [{
                        backgroundColor: _underlayInactive,
                    }, _this.props.style],
            });
        };
        _this._updateMixin(props, true);
        _this._buildInternalProps(props);
        if (props.arbitrateFocus) {
            _this._updateFocusArbitratorProvider(props);
        }
        return _this;
    }
    View.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        this._updateMixin(nextProps, false);
        this._buildInternalProps(nextProps);
        if (('arbitrateFocus' in nextProps) && (this.props.arbitrateFocus !== nextProps.arbitrateFocus)) {
            this._updateFocusArbitratorProvider(nextProps);
        }
    };
    View.prototype.UNSAFE_componentWillUpdate = function (nextProps, nextState) {
        //
        // Exit fast if not an "animated children" case
        if (!(nextProps.animateChildEnter || nextProps.animateChildMove || nextProps.animateChildLeave)) {
            return;
        }
        // Each time the component receives new children, animates insertions, removals,
        // and moves that occurred since the previous render. Uses React Native's
        // LayoutAnimation API to achieve this.
        //
        // Caveats:
        //   - The animations are not scoped. All layout changes in the app that occur during the
        //     next bridge transaction will be animated. This is due to a limitation in React Native's
        //     LayoutAnimation API.
        //   - Removals are not animated. The removed item disappears instantly. Items whose positions
        //     were affected by the removal are animated into their new positions. This is due to a
        //     limitation in React Native's LayoutAnimation API.
        //
        // The web implementation doesn't support string refs. For consistency, do the same assert
        // in the native implementation.
        (0, assert_1.default)(findInvalidRefs(nextProps.children).length === 0, 'Invalid ref(s): ' + JSON.stringify(findInvalidRefs(nextProps.children)) +
            ' Only callback refs are supported when using child animations on a `View`');
        var prevChildrenKeys = this._childrenKeys || [];
        var nextChildrenKeys = extractChildrenKeys(nextProps.children);
        this._childrenKeys = nextChildrenKeys;
        if (_childrenEdited(prevChildrenKeys, nextChildrenKeys)) {
            var updateConfig = {
                delay: 0,
                duration: 300,
                type: LayoutAnimation.Types.easeOut,
            };
            var createConfig = {
                delay: 75,
                duration: 150,
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            };
            var configDictionary = {
                duration: 300,
            };
            if (nextProps.animateChildMove) {
                configDictionary.update = updateConfig;
            }
            if (nextProps.animateChildEnter) {
                configDictionary.create = createConfig;
            }
            LayoutAnimation.configureNext(configDictionary);
        }
    };
    View.prototype.componentDidMount = function () {
        this._isMounted = true;
        if (this._mixin_componentDidMount) {
            this._mixin_componentDidMount();
        }
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    View.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this._mixin_componentWillUnmount) {
            this._mixin_componentWillUnmount();
        }
    };
    View.prototype._updateMixin = function (props, initial) {
        var isButton = this._isButton(props);
        if (isButton && !this._mixinIsApplied) {
            // Create local handlers
            this.touchableHandlePress = this.touchableHandlePress.bind(this);
            this.touchableHandleLongPress = this.touchableHandleLongPress.bind(this);
            this.touchableGetPressRectOffset = this.touchableGetPressRectOffset.bind(this);
            this.touchableHandleActivePressIn = this.touchableHandleActivePressIn.bind(this);
            this.touchableHandleActivePressOut = this.touchableHandleActivePressOut.bind(this);
            this.touchableGetHighlightDelayMS = this.touchableGetHighlightDelayMS.bind(this);
            // @ts-ignore
            applyMixin(this, RN.Touchable.Mixin, [
                // Properties that View and RN.Touchable.Mixin have in common. View needs
                // to dispatch these methods to RN.Touchable.Mixin manually.
                'componentDidMount',
                'componentWillUnmount',
            ]);
            // @ts-ignore
            this._mixin_componentDidMount = RN.Touchable.Mixin.componentDidMount || noop;
            // @ts-ignore
            this._mixin_componentWillUnmount = RN.Touchable.Mixin.componentWillUnmount || noop;
            if (initial) {
                this.state = this.touchableGetInitialState();
            }
            else {
                this.setState(this.touchableGetInitialState());
            }
            this._mixinIsApplied = true;
        }
        else if (!isButton && this._mixinIsApplied) {
            // @ts-ignore
            removeMixin(this, RN.Touchable.Mixin, [
                'componentDidMount',
                'componentWillUnmount',
            ]);
            delete this._mixin_componentDidMount;
            delete this._mixin_componentWillUnmount;
            delete this.touchableHandlePress;
            delete this.touchableHandleLongPress;
            delete this.touchableGetPressRectOffset;
            delete this.touchableHandleActivePressIn;
            delete this.touchableHandleActivePressOut;
            delete this.touchableGetHighlightDelayMS;
            this._mixinIsApplied = false;
        }
    };
    View.prototype.getChildContext = function () {
        var childContext = {};
        if (this._focusArbitratorProvider) {
            childContext.focusArbitrator = this._focusArbitratorProvider;
        }
        return childContext;
    };
    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    View.prototype._buildInternalProps = function (props) {
        this._internalProps = (0, lodashMini_1.clone)(props);
        this._internalProps.ref = this._setNativeComponent;
        if (props.testId) {
            // Convert from testId to testID.
            this._internalProps.testID = this._internalProps.testId;
            delete this._internalProps.testId;
        }
        // Translate accessibilityProps from RX to RN, there are type diferrences for example:
        // accessibilityLiveRegion prop is number (RX.Types.AccessibilityLiveRegion) in RX, but
        // string is expected by RN.View
        var accessibilityProps = {
            importantForAccessibility: AccessibilityUtil_1.default.importantForAccessibilityToString(props.importantForAccessibility),
            accessibilityLabel: props.accessibilityLabel || props.title,
            accessibilityTraits: AccessibilityUtil_1.default.accessibilityTraitToString(props.accessibilityTraits),
            accessibilityComponentType: AccessibilityUtil_1.default.accessibilityComponentTypeToString(props.accessibilityTraits),
            accessibilityLiveRegion: AccessibilityUtil_1.default.accessibilityLiveRegionToString(props.accessibilityLiveRegion),
        };
        if (_isNativeMacOs && App_1.default.supportsExperimentalKeyboardNavigation && (props.onPress ||
            (props.tabIndex !== undefined && props.tabIndex >= 0))) {
            var macAccessibilityProps = accessibilityProps;
            if (props.tabIndex !== -1) {
                macAccessibilityProps.acceptsKeyboardFocus = true;
                macAccessibilityProps.enableFocusRing = true;
            }
            if (props.onPress) {
                macAccessibilityProps.onClick = props.onPress;
            }
        }
        this._internalProps = (0, lodashMini_1.extend)(this._internalProps, accessibilityProps);
        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }
        if (props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        }
        else {
            if (props.ignorePointerEvents) {
                this._internalProps.pointerEvents = 'box-none';
            }
        }
        if (props.onKeyPress) {
            this._internalProps.onKeyPress = this._onKeyPress;
        }
        var baseStyle = this._getStyles(props);
        this._internalProps.style = baseStyle;
        if (this._mixinIsApplied) {
            var responderProps = {
                onStartShouldSetResponder: this.props.onStartShouldSetResponder || this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.props.onResponderTerminationRequest || this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.props.onResponderGrant || this.touchableHandleResponderGrant,
                onResponderMove: this.props.onResponderMove || this.touchableHandleResponderMove,
                onResponderRelease: this.props.onResponderRelease || this.touchableHandleResponderRelease,
                onResponderTerminate: this.props.onResponderTerminate || this.touchableHandleResponderTerminate,
            };
            this._internalProps = (0, lodashMini_1.extend)(this._internalProps, responderProps);
            if (!this.props.disableTouchOpacityAnimation) {
                var opacityValueFromProps = this._getDefaultOpacityValue(props);
                if (this._defaultOpacityValue !== opacityValueFromProps) {
                    this._defaultOpacityValue = opacityValueFromProps;
                    this._opacityAnimatedValue = new Animated_1.default.Value(this._defaultOpacityValue);
                    this._opacityAnimatedStyle = Styles_1.default.createAnimatedViewStyle({
                        opacity: this._opacityAnimatedValue,
                    });
                }
                this._internalProps.style = Styles_1.default.combine([baseStyle, this._opacityAnimatedStyle]);
            }
            this._internalProps.tooltip = this.props.title;
        }
        if (this.props.useSafeInsets) {
            this._internalProps.style = Styles_1.default.combine([this._internalProps.style, safeInsetsStyle]);
        }
    };
    View.prototype._isTouchFeedbackApplicable = function () {
        return this._isMounted && this._mixinIsApplied && !!this._nativeComponent;
    };
    View.prototype._opacityActive = function (duration) {
        this._setOpacityTo(this.props.activeOpacity || _defaultActiveOpacity, duration);
    };
    View.prototype._opacityInactive = function (duration) {
        this._setOpacityTo(this._defaultOpacityValue, duration);
    };
    View.prototype._getDefaultOpacityValue = function (props) {
        var flattenedStyles;
        if (props && props.style) {
            flattenedStyles = RN.StyleSheet.flatten(props.style);
        }
        return flattenedStyles && flattenedStyles.opacity || 1;
    };
    View.prototype._setOpacityTo = function (value, duration) {
        Animated_1.default.timing(this._opacityAnimatedValue, {
            toValue: value,
            duration: duration,
            easing: Animated_1.default.Easing.InOut(),
            useNativeDriver: true,
        }).start();
    };
    View.prototype._showUnderlay = function () {
        if (!this._nativeComponent) {
            return;
        }
        this._nativeComponent.setNativeProps({
            style: {
                backgroundColor: this.props.underlayColor,
            },
        });
    };
    View.prototype._isButton = function (viewProps) {
        return !!(viewProps.onPress || viewProps.onLongPress);
    };
    View.prototype._updateFocusArbitratorProvider = function (props) {
        if (props.arbitrateFocus) {
            if (this._focusArbitratorProvider) {
                this._focusArbitratorProvider.setCallback(props.arbitrateFocus);
            }
            else {
                this._focusArbitratorProvider = new AutoFocusHelper_1.FocusArbitratorProvider(this, props.arbitrateFocus);
            }
        }
        else if (this._focusArbitratorProvider) {
            delete this._focusArbitratorProvider;
        }
    };
    View.prototype.render = function () {
        var ViewToRender = RN.View;
        if (this._isButton(this.props)) {
            ViewToRender = RN.Animated.View;
        }
        else if (this.props.useSafeInsets) {
            ViewToRender = RN.SafeAreaView;
        }
        return (React.createElement(ViewToRender, __assign({}, this._internalProps), this.props.children));
    };
    View.prototype.touchableHandlePress = function (e) {
        UserInterface_1.default.evaluateTouchLatency(e);
        if (EventHelpers_1.default.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers_1.default.toMouseEvent(e));
            }
        }
        else {
            if (this.props.onPress) {
                this.props.onPress(EventHelpers_1.default.toMouseEvent(e));
            }
        }
    };
    View.prototype.touchableHandleLongPress = function (e) {
        if (!EventHelpers_1.default.isRightMouseButton(e)) {
            if (this.props.onLongPress) {
                this.props.onLongPress(EventHelpers_1.default.toMouseEvent(e));
            }
        }
    };
    View.prototype.touchableHandleActivePressIn = function (e) {
        if (this._isTouchFeedbackApplicable()) {
            if (this.props.underlayColor) {
                if (this._hideTimeout) {
                    Timers_1.default.clearTimeout(this._hideTimeout);
                    this._hideTimeout = undefined;
                }
                this._showUnderlay();
            }
            // We do not want to animate opacity if underlayColour is provided. Unless an explicit activeOpacity is provided
            if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                this._opacityActive(_activeOpacityAnimationDuration);
            }
        }
    };
    View.prototype.touchableHandleActivePressOut = function (e) {
        if (this._isTouchFeedbackApplicable()) {
            if (this.props.underlayColor) {
                if (this._hideTimeout) {
                    Timers_1.default.clearTimeout(this._hideTimeout);
                }
                this._hideTimeout = Timers_1.default.setTimeout(this._hideUnderlay, _hideUnderlayTimeout);
            }
            if (!this.props.disableTouchOpacityAnimation && (this.props.activeOpacity || !this.props.underlayColor)) {
                this._opacityInactive(_inactiveOpacityAnimationDuration);
            }
        }
    };
    View.prototype.touchableGetHighlightDelayMS = function () {
        return 20;
    };
    View.prototype.touchableGetPressRectOffset = function () {
        return { top: 20, left: 20, right: 20, bottom: 100 };
    };
    View.prototype.setFocusRestricted = function (restricted) {
        // Nothing to do.
    };
    View.prototype.setFocusLimited = function (limited) {
        // Nothing to do.
    };
    View.prototype.blur = function () {
        if (ViewBase_1.default._supportsNativeFocusBlur && this._nativeComponent && this._nativeComponent.blur) {
            this._nativeComponent.blur();
        }
    };
    View.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._isMounted; });
    };
    View.prototype.focus = function () {
        if (this._isMounted) {
            AccessibilityUtil_1.default.setAccessibilityFocus(this);
        }
        if (ViewBase_1.default._supportsNativeFocusBlur && this._nativeComponent) {
            if (this._nativeComponent.focus) {
                this._nativeComponent.focus();
            }
            else if (this._nativeComponent._component) {
                // Components can be wrapped by RN.Animated implementation, peek at the inner workings here
                var innerComponent = this._nativeComponent._component;
                if (innerComponent && innerComponent.focus) {
                    innerComponent.focus();
                }
            }
        }
    };
    View.contextTypes = {
        focusArbitrator: PropTypes.object,
    };
    View.childContextTypes = {
        focusArbitrator: PropTypes.object,
    };
    return View;
}(ViewBase_1.default));
exports.View = View;
exports.default = View;
