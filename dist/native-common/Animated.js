"use strict";
/**
 * Animated.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Animation abstraction.
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
exports.makeAnimated = exports.AnimatedCommon = exports.CommonAnimatedClasses = void 0;
var React = require("react");
var RN = require("react-native");
var Easing_1 = require("../common/Easing");
var RX = require("../common/Interfaces");
var Image_1 = require("./Image");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var View_1 = require("./View");
exports.CommonAnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(Image_1.default),
    Text: RN.Animated.createAnimatedComponent(Text_1.default),
    TextInput: RN.Animated.createAnimatedComponent(TextInput_1.default),
    View: RN.Animated.createAnimatedComponent(View_1.default),
};
var animatedClasses = exports.CommonAnimatedClasses;
var AnimatedWrapper = /** @class */ (function (_super) {
    __extends(AnimatedWrapper, _super);
    function AnimatedWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onMount = function (component) {
            _this._mountedComponent = component || undefined;
        };
        return _this;
    }
    AnimatedWrapper.prototype.setNativeProps = function (props) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    };
    AnimatedWrapper.prototype.focus = function () {
        var innerComponent = this._mountedComponent ? this._mountedComponent._component : undefined;
        if (innerComponent && innerComponent.focus) {
            innerComponent.focus();
        }
    };
    AnimatedWrapper.prototype.requestFocus = function () {
        var innerComponent = this._mountedComponent ? this._mountedComponent._component : undefined;
        if (innerComponent && innerComponent.requestFocus) {
            innerComponent.requestFocus();
        }
    };
    AnimatedWrapper.prototype.blur = function () {
        var innerComponent = this._mountedComponent ? this._mountedComponent._component : undefined;
        if (innerComponent && innerComponent.blur) {
            innerComponent.blur();
        }
    };
    return AnimatedWrapper;
}(RX.AnimatedComponent));
var AnimatedImage = /** @class */ (function (_super) {
    __extends(AnimatedImage, _super);
    function AnimatedImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedImage.prototype.render = function () {
        var additionalProps = { ref: this._onMount, style: this.props.style };
        return (React.createElement(animatedClasses.Image, __assign({}, this.props, additionalProps), this.props.children));
    };
    return AnimatedImage;
}(AnimatedWrapper));
var AnimatedText = /** @class */ (function (_super) {
    __extends(AnimatedText, _super);
    function AnimatedText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedText.prototype.render = function () {
        var additionalProps = { ref: this._onMount, style: this.props.style };
        return (React.createElement(animatedClasses.Text, __assign({}, this.props, additionalProps), this.props.children));
    };
    return AnimatedText;
}(AnimatedWrapper));
var AnimatedTextInput = /** @class */ (function (_super) {
    __extends(AnimatedTextInput, _super);
    function AnimatedTextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedTextInput.prototype.render = function () {
        var additionalProps = { ref: this._onMount, style: this.props.style };
        return (React.createElement(animatedClasses.TextInput, __assign({}, this.props, additionalProps), this.props.children));
    };
    return AnimatedTextInput;
}(AnimatedWrapper));
var AnimatedView = /** @class */ (function (_super) {
    __extends(AnimatedView, _super);
    function AnimatedView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedView.prototype.setFocusRestricted = function (restricted) {
        // Nothing to do.
    };
    AnimatedView.prototype.setFocusLimited = function (limited) {
        // Nothing to do.
    };
    AnimatedView.prototype.render = function () {
        var additionalProps = { ref: this._onMount, style: this.props.style };
        return (React.createElement(animatedClasses.View, __assign({}, this.props, additionalProps), this.props.children));
    };
    return AnimatedView;
}(AnimatedWrapper));
var FocusRestrictedAnimatedView = /** @class */ (function (_super) {
    __extends(FocusRestrictedAnimatedView, _super);
    function FocusRestrictedAnimatedView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusRestrictedAnimatedView.prototype.setFocusRestricted = function (restricted) {
        var innerComponent = this._mountedComponent ? this._mountedComponent._component : undefined;
        if (innerComponent && innerComponent.setFocusRestricted) {
            innerComponent.setFocusRestricted(restricted);
        }
    };
    FocusRestrictedAnimatedView.prototype.setFocusLimited = function (limited) {
        var innerComponent = this._mountedComponent ? this._mountedComponent._component : undefined;
        if (innerComponent && innerComponent.setFocusLimited) {
            innerComponent.setFocusLimited(limited);
        }
    };
    return FocusRestrictedAnimatedView;
}(AnimatedView));
var timing = function (value, config) {
    var isLooping = config.loop !== undefined && config.loop !== null;
    return {
        start: function (onEnd) {
            function animate() {
                var timingConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing.function : undefined,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver || true,
                };
                RN.Animated.timing(value, timingConfig).start(function (result) {
                    if (onEnd) {
                        onEnd(result);
                    }
                    if (isLooping) {
                        value.setValue(config.loop.restartFrom);
                        // Hack to get into the loop
                        animate();
                    }
                });
            }
            // Trigger animation loop (hack for now)
            animate();
        },
        stop: function () {
            isLooping = false;
            value.stopAnimation();
        },
    };
};
exports.AnimatedCommon = {
    Easing: Easing_1.default,
    timing: timing,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence,
    Value: RN.Animated.Value,
    createValue: function (initialValue) { return new RN.Animated.Value(initialValue); },
    interpolate: function (animatedValue, inputRange, outputRange) { return animatedValue.interpolate({
        inputRange: inputRange,
        outputRange: outputRange,
    }); },
};
function makeAnimated(nativeAnimatedClasses, useFocusRestrictedView) {
    if (nativeAnimatedClasses) {
        animatedClasses = nativeAnimatedClasses;
    }
    var animated = __assign({ 
        // platform specific animated components
        Image: AnimatedImage, Text: AnimatedText, TextInput: AnimatedTextInput, View: useFocusRestrictedView ? FocusRestrictedAnimatedView : AnimatedView }, exports.AnimatedCommon);
    return animated;
}
exports.makeAnimated = makeAnimated;
exports.default = exports.AnimatedCommon;
