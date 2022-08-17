"use strict";
/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform ScrollView abstraction.
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
exports.ScrollView = void 0;
var React = require("react");
var RN = require("react-native");
var ViewBase_1 = require("./ViewBase");
// TODO: #737970 Remove special case for UWP/MacOS when this bug is fixed. The bug
//   causes you to have to click twice instead of once on some pieces of UI in
//   order for the UI to acknowledge your interaction.
var overrideKeyboardShouldPersistTaps = RN.Platform.OS === 'macos' || RN.Platform.OS === 'windows';
var ScrollView = /** @class */ (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._scrollTop = 0;
        _this._scrollLeft = 0;
        _this._onScroll = function (event) {
            var contentOffset = event.nativeEvent.contentOffset;
            _this._scrollTop = contentOffset.y;
            _this._scrollLeft = contentOffset.x;
            if (_this.props.onScroll) {
                _this.props.onScroll(_this._scrollTop, _this._scrollLeft);
            }
        };
        return _this;
    }
    ScrollView.prototype._render = function (nativeProps) {
        if (this.props.scrollXAnimatedValue || this.props.scrollYAnimatedValue) {
            // Have to jump over to an Animated ScrollView to use an RN.Animated.event...
            return (React.createElement(RN.Animated.ScrollView, __assign({}, nativeProps), nativeProps.children));
        }
        else {
            return (React.createElement(RN.ScrollView, __assign({}, nativeProps), nativeProps.children));
        }
    };
    ScrollView.prototype.render = function () {
        var scrollThrottle = this.props.scrollEventThrottle || 16;
        if (scrollThrottle === 0) {
            // Fire at 60fps
            scrollThrottle = 16;
        }
        var layoutCallback = this.props.onLayout ?
            // We have a callback function, call the wrapper
            this._onLayout :
            undefined;
        var scrollHandler;
        if (this.props.scrollXAnimatedValue || this.props.scrollYAnimatedValue) {
            // For more details on this craziness, reference:
            // https://facebook.github.io/react-native/docs/animated#handling-gestures-and-other-events
            var handlerWrapper = {
                nativeEvent: {
                    contentOffset: {},
                },
            };
            if (this.props.scrollXAnimatedValue) {
                handlerWrapper.nativeEvent.contentOffset.x = this.props.scrollXAnimatedValue;
            }
            if (this.props.scrollYAnimatedValue) {
                handlerWrapper.nativeEvent.contentOffset.y = this.props.scrollYAnimatedValue;
            }
            var eventConfig = {
                useNativeDriver: true,
            };
            if (this.props.onScroll) {
                eventConfig.listener = this._onScroll;
            }
            // react-native.d.ts is wrong for the eventconfig typing, so casting to any for now.
            scrollHandler = RN.Animated.event([handlerWrapper], eventConfig);
        }
        else if (this.props.onScroll) {
            scrollHandler = this._onScroll;
        }
        else {
            scrollHandler = undefined;
        }
        // 1) keyboardShouldPersistTaps may be overridden, superceding all other settings
        // 2) in the absence of any other setting, 'never' is the default
        // 3) if a boolean is seen, translate to 'always' or 'never' as the boolean is deprecated
        // 4) it is also possible to see a string value of 'handled'
        var keyboardShouldPersistTaps = 'never';
        if (overrideKeyboardShouldPersistTaps || this.props.keyboardShouldPersistTaps === true) {
            // If there is an override or a boolean true, translate it to 'always'
            keyboardShouldPersistTaps = 'always';
        }
        else if (typeof this.props.keyboardShouldPersistTaps === 'string') {
            // If there is no override, and a string && non-boolean was provided, use it without translation
            keyboardShouldPersistTaps = this.props.keyboardShouldPersistTaps;
        }
        // NOTE: We are setting `automaticallyAdjustContentInsets` to false
        // (http://facebook.github.io/react-native/docs/scrollview.html#automaticallyadjustcontentinsets). The
        // 'automaticallyAdjustContentInsets' property is designed to offset the ScrollView's content to account for the
        // navigation and tab bars in iOS.
        // (navigationBarHidden={true}). We believe that React Native may not be calculating the content insets for the
        // ScrollView correctly in this situation. Disabling this calculation seems to fix the ScrollView inset issues.
        // Currently RX does not expose any components that would require `automaticallyAdjustContentInsets` to be
        // set to true.
        // We also set removeClippedSubviews to false, overriding the default value. Most of the scroll views
        // we use are virtualized anyway.
        var internalProps = {
            // Bug in react-native.d.ts.  style should be "style?: StyleProp<ScrollViewStyle>;" but instead is ViewStyle.
            style: this.props.style,
            onScroll: scrollHandler,
            automaticallyAdjustContentInsets: false,
            showsHorizontalScrollIndicator: this.props.showsHorizontalScrollIndicator,
            showsVerticalScrollIndicator: this.props.showsVerticalScrollIndicator,
            keyboardDismissMode: this.props.keyboardDismissMode,
            keyboardShouldPersistTaps: keyboardShouldPersistTaps,
            scrollEnabled: this.props.scrollEnabled,
            onContentSizeChange: this.props.onContentSizeChange,
            onLayout: layoutCallback,
            scrollEventThrottle: scrollThrottle,
            horizontal: this.props.horizontal,
            bounces: this.props.bounces,
            pagingEnabled: this.props.pagingEnabled,
            snapToInterval: this.props.snapToInterval,
            decelerationRate: typeof this.props.snapToInterval === 'number' ? 'fast' : undefined,
            scrollsToTop: this.props.scrollsToTop,
            removeClippedSubviews: false,
            overScrollMode: this.props.overScrollMode,
            scrollIndicatorInsets: this.props.scrollIndicatorInsets,
            onScrollBeginDrag: this.props.onScrollBeginDrag,
            onScrollEndDrag: this.props.onScrollEndDrag,
            children: this.props.children,
            testID: this.props.testId,
        };
        return this._render(internalProps);
    };
    ScrollView.prototype.setScrollTop = function (scrollTop, animate) {
        if (this._nativeComponent) {
            var scrollParams = { x: this._scrollLeft, y: scrollTop, animated: animate };
            if (this._nativeComponent.scrollTo) {
                this._nativeComponent.scrollTo(scrollParams);
            }
            else if (this._nativeComponent._component) {
                // Components can be wrapped by RN.Animated implementation, peek at the inner workings here
                var innerComponent = this._nativeComponent._component;
                if (innerComponent && innerComponent.scrollTo) {
                    innerComponent.scrollTo(scrollParams);
                }
            }
        }
    };
    ScrollView.prototype.setScrollLeft = function (scrollLeft, animate) {
        if (this._nativeComponent) {
            var scrollParams = { x: scrollLeft, y: this._scrollTop, animated: animate };
            if (this._nativeComponent.scrollTo) {
                this._nativeComponent.scrollTo(scrollParams);
            }
            else if (this._nativeComponent._component) {
                // Components can be wrapped by RN.Animated implementation, peek at the inner workings here
                var innerComponent = this._nativeComponent._component;
                if (innerComponent && innerComponent.scrollTo) {
                    innerComponent.scrollTo(scrollParams);
                }
            }
        }
    };
    ScrollView.useCustomScrollbars = function () {
        // not needed
    };
    return ScrollView;
}(ViewBase_1.default));
exports.ScrollView = ScrollView;
exports.default = ScrollView;
