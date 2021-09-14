"use strict";
/**
 * Animated.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements animated components for web version of ReactXP.
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
exports.Easing = exports.interpolate = exports.createValue = exports.View = exports.TextInput = exports.Text = exports.Image = exports.parallel = exports.sequence = exports.timing = exports.InterpolatedValue = exports.Value = exports.Animation = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var AppConfig_1 = require("../common/AppConfig");
var Easing_1 = require("../common/Easing");
exports.Easing = Easing_1.default;
var RX = require("../common/Interfaces");
var executeTransition_1 = require("./animated/executeTransition");
var Image_1 = require("./Image");
var _ = require("./utils/lodashMini");
var Styles_1 = require("./Styles");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var View_1 = require("./View");
// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
var animatedPropUnits = {
    // AnimatedFlexboxStyleRules
    height: 'px',
    width: 'px',
    left: 'px',
    right: 'px',
    top: 'px',
    bottom: 'px',
    // AnimatedTransformStyleRules
    perspective: '',
    rotate: 'deg',
    rotateX: 'deg',
    rotateY: 'deg',
    rotateZ: 'deg',
    scale: '',
    scaleX: '',
    scaleY: '',
    scaleZ: '',
    translateX: 'px',
    translateY: 'px',
    skewX: '',
    skewY: '',
    // AnimatedViewAndImageCommonStyleRules
    backgroundColor: '',
    opacity: '',
    borderRadius: 'px',
    // AnimatedTextStyleRules
    color: '',
    fontSize: 'px',
};
// Every Animation subclass should extend this.
var Animation = /** @class */ (function () {
    function Animation() {
    }
    return Animation;
}());
exports.Animation = Animation;
// The animated value object
var Value = /** @class */ (function (_super) {
    __extends(Value, _super);
    // Initializes the object with the defaults and assigns the id for the animated value.
    function Value(value) {
        var _this = _super.call(this, value) || this;
        _this._value = value;
        _this._listeners = [];
        return _this;
    }
    // Gets the current animated value (this gets updates after animation concludes)
    Value.prototype._getInputValue = function () {
        return this._value;
    };
    Value.prototype._getOutputValue = function () {
        return this._getInterpolatedValue(this._value);
    };
    Value.prototype._getInterpolatedValue = function (inputVal) {
        return inputVal;
    };
    Value.prototype._isInterpolated = function () {
        return false;
    };
    Value.prototype.interpolate = function (config) {
        return new InterpolatedValue(config, this);
    };
    // Updates a value in this animated reference.
    Value.prototype.setValue = function (value) {
        var _this = this;
        if (value === undefined) {
            throw new Error('An invalid value was passed into setvalue in the animated value api');
        }
        // If value the same, do nothing.
        if (value === this._value) {
            return;
        }
        this._value = value;
        // Notify subscribers about the new value.
        _.each(this._listeners, function (listener) { return listener.setValue(_this, value); });
    };
    // Add listener for when the value gets updated.
    Value.prototype._addListener = function (listenerToAdd) {
        if (this._listeners.indexOf(listenerToAdd) < 0) {
            this._listeners.push(listenerToAdd);
        }
    };
    // Remove a specific listner.
    Value.prototype._removeListener = function (listenerToRemove) {
        this._listeners = _.filter(this._listeners, function (listener) { return listener !== listenerToRemove; });
    };
    // Remove all listeners.
    Value.prototype._removeAllListeners = function () {
        this._listeners = [];
    };
    // Start a specific animation.
    Value.prototype._startTransition = function (toValue, duration, easing, delay, onEnd) {
        var _this = this;
        // If there are no listeners, the app probably has a bug where it's
        // starting an animation before the associated element is mounted.
        // Complete the animation immediately by updating to the end value
        // and caling the onEnd callback.
        if (this._listeners.length === 0) {
            this._updateFinalValue(toValue);
            if (onEnd) {
                onEnd({ finished: false });
            }
            return;
        }
        // Only call onEnd once for a series of listeners.
        var onEndCalled = false;
        var onEndWrapper = function (result) {
            if (onEndCalled) {
                return;
            }
            onEndCalled = true;
            onEnd(result);
        };
        _.each(this._listeners, function (listener) {
            listener.startTransition(_this, _this._getOutputValue(), _this._getInterpolatedValue(toValue), duration, easing, delay, onEndWrapper);
        });
    };
    // Stop animation.
    Value.prototype._stopTransition = function () {
        var _this = this;
        _.each(this._listeners, function (listener) {
            var updatedValue = listener.stopTransition(_this);
            if (updatedValue !== undefined) {
                _this._updateFinalValue(updatedValue);
            }
        });
    };
    // After an animation is stopped or completed, updates
    // the final value.
    Value.prototype._updateFinalValue = function (value) {
        this.setValue(value);
    };
    return Value;
}(RX.Types.AnimatedValue));
exports.Value = Value;
var InterpolatedValue = /** @class */ (function (_super) {
    __extends(InterpolatedValue, _super);
    function InterpolatedValue(_config, rootValue) {
        var _this = _super.call(this, rootValue._getOutputValue()) || this;
        _this._config = _config;
        if (!_this._config || !_this._config.inputRange || !_this._config.outputRange ||
            _this._config.inputRange.length < 2 || _this._config.outputRange.length < 2 ||
            _this._config.inputRange.length !== _this._config.outputRange.length) {
            throw new Error('The interpolation config is invalid. Input and output arrays must be same length.');
        }
        var newInterpolationConfig = {};
        _.each(_this._config.inputRange, function (key, index) {
            newInterpolationConfig[key] = _this._config.outputRange[index];
        });
        _this._interpolationConfig = newInterpolationConfig;
        rootValue._addListener({
            setValue: function (valueObject, newValue) {
                _this.setValue(valueObject._getOutputValue());
            },
            startTransition: function (valueObject, from, toValue, duration, easing, delay, onEnd) {
                _this._startTransition(toValue, duration, easing, delay, onEnd);
            },
            stopTransition: function (valueObject) {
                _this._stopTransition();
                return undefined;
            },
        });
        return _this;
    }
    InterpolatedValue.prototype._startTransition = function (toValue, duration, easing, delay, onEnd) {
        // This API doesn't currently support more than two elements in the
        // interpolation array. Supporting this in the web would require the
        // use of JS-driven animations or keyframes, both of which are prohibitively
        // expensive from a performance and responsiveness perspective.
        if (this._config.inputRange.length !== 2) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.log('Web implementation of interpolate API currently supports only two interpolation values.');
            }
        }
        _super.prototype._startTransition.call(this, toValue, duration, easing, delay, onEnd);
    };
    InterpolatedValue.prototype._convertValueToNumeric = function (inputVal) {
        if (_.isNumber(inputVal)) {
            return inputVal;
        }
        return parseInt(inputVal, 10);
    };
    InterpolatedValue.prototype._addUnitsToNumericValue = function (value, templateValue) {
        if (_.isNumber(templateValue)) {
            return value;
        }
        // Does the template contain any of the common units?
        var templateString = templateValue;
        var commonUnits = ['deg', 'grad', 'rad'];
        for (var _i = 0, commonUnits_1 = commonUnits; _i < commonUnits_1.length; _i++) {
            var unit = commonUnits_1[_i];
            if (templateString.indexOf(unit) > 0) {
                return value.toString() + unit;
            }
        }
        return value;
    };
    InterpolatedValue.prototype._getInterpolatedValue = function (inputVal) {
        var _this = this;
        if (!this._interpolationConfig) {
            throw new Error('There is no interpolation config but one is required');
        }
        var numericInputValue = this._convertValueToNumeric(inputVal);
        var outputValues = this._config.outputRange.map(function (value) { return _this._convertValueToNumeric(value); });
        if (this._interpolationConfig[numericInputValue]) {
            return this._interpolationConfig[numericInputValue];
        }
        if (inputVal < this._config.inputRange[0]) {
            return outputValues[0];
        }
        for (var i = 1; i < this._config.inputRange.length; i++) {
            if (inputVal < this._config.inputRange[i]) {
                var ratio = (numericInputValue - this._config.inputRange[i - 1]) /
                    (this._config.inputRange[i] - this._config.inputRange[i - 1]);
                return this._addUnitsToNumericValue(this._config.outputRange[i] * ratio +
                    this._config.outputRange[i - 1] * (1 - ratio), inputVal);
            }
        }
        return this._addUnitsToNumericValue(outputValues[this._config.inputRange.length - 1], inputVal);
    };
    InterpolatedValue.prototype._isInterpolated = function () {
        return true;
    };
    return InterpolatedValue;
}(Value));
exports.InterpolatedValue = InterpolatedValue;
var timing = function (value, config) {
    if (!value || !config) {
        throw new Error('Timing animation requires value and config');
    }
    var stopLooping = false;
    return {
        start: function (onEnd) {
            var animate = function () {
                if (config.loop) {
                    value.setValue(config.loop.restartFrom);
                }
                var easing = config.easing || Easing_1.default.Default();
                var duration = config.duration !== undefined ? config.duration : 500;
                var delay = config.delay || 0;
                value._startTransition(config.toValue, duration, easing.cssName, delay, function (result) {
                    // Restart the loop?
                    if (config.loop && !stopLooping) {
                        animate();
                    }
                    else {
                        value._updateFinalValue(config.toValue);
                    }
                    if (onEnd) {
                        onEnd(result);
                    }
                });
            };
            // Trigger animation loop
            animate();
        },
        stop: function () {
            stopLooping = true;
            value._stopTransition();
        },
    };
};
exports.timing = timing;
var sequence = function (animations) {
    if (!animations) {
        throw new Error('Sequence animation requires a list of animations');
    }
    var hasBeenStopped = false;
    var doneCount = 0;
    var result = {
        start: function (onEnd) {
            if (!animations || animations.length === 0) {
                throw new Error('No animations were passed to the animated sequence API');
            }
            var executeNext = function () {
                doneCount++;
                var isFinished = doneCount === animations.length;
                if (hasBeenStopped || isFinished) {
                    doneCount = 0;
                    hasBeenStopped = false;
                    if (onEnd) {
                        onEnd({ finished: isFinished });
                    }
                    return;
                }
                animations[doneCount].start(executeNext);
            };
            animations[doneCount].start(executeNext);
        },
        stop: function () {
            if (doneCount < animations.length) {
                doneCount = 0;
                hasBeenStopped = true;
                animations[doneCount].stop();
            }
        },
    };
    return result;
};
exports.sequence = sequence;
var parallel = function (animations) {
    if (!animations) {
        throw new Error('Parallel animation requires a list of animations');
    }
    // Variable to make sure we only call stop() at most once
    var hasBeenStopped = false;
    var doneCount = 0;
    var result = {
        start: function (onEnd) {
            if (!animations || animations.length === 0) {
                throw new Error('No animations were passed to the animated parallel API');
            }
            // Walk through animations and start all as soon as possible.
            animations.forEach(function (animation, id) {
                animation.start(function (animationResult) {
                    doneCount++;
                    var isFinished = doneCount === animations.length;
                    if (hasBeenStopped || isFinished) {
                        doneCount = 0;
                        hasBeenStopped = false;
                        if (onEnd) {
                            onEnd({ finished: isFinished });
                        }
                        return;
                    }
                });
            });
        },
        stop: function () {
            doneCount = 0;
            hasBeenStopped = true;
            animations.forEach(function (animation) {
                animation.stop();
            });
        },
    };
    return result;
};
exports.parallel = parallel;
// Function for creating wrapper AnimatedComponent around passed in component
function createAnimatedComponent(Component) {
    var AnimatedComponentGenerated = /** @class */ (function (_super) {
        __extends(AnimatedComponentGenerated, _super);
        function AnimatedComponentGenerated(props) {
            var _this = _super.call(this, props) || this;
            _this._mountedComponent = null;
            _this._onMount = function (component) {
                _this._mountedComponent = component;
            };
            _this._animatedAttributes = {};
            _this._animatedTransforms = {};
            _this._updateStyles(props);
            return _this;
        }
        AnimatedComponentGenerated.prototype.setNativeProps = function (props) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('setNativeProps not supported on web');
            }
        };
        AnimatedComponentGenerated.prototype.UNSAFE_componentWillReceiveProps = function (props) {
            this._updateStyles(props);
        };
        AnimatedComponentGenerated.prototype.setValue = function (valueObject, newValue) {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }
            var attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                var domNode = this._getDomNode();
                if (domNode) {
                    var cssValue = this._generateCssAttributeValue(attrib, valueObject._getOutputValue());
                    domNode.style[attrib] = cssValue;
                }
                return;
            }
            var transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
            if (transform) {
                var domNode = this._getDomNode();
                if (domNode) {
                    domNode.style.transform = this._generateCssTransformList(true);
                }
            }
        };
        AnimatedComponentGenerated.prototype.startTransition = function (valueObject, fromValue, toValue, duration, easing, delay, onEnd) {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }
            var updateTransition = false;
            var attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                if (this._animatedAttributes[attrib].activeTransition) {
                    if (AppConfig_1.default.isDevelopmentMode()) {
                        console.error('Animation started while animation was already pending');
                    }
                }
                this._animatedAttributes[attrib].activeTransition = {
                    property: Styles_1.default.convertJsToCssStyle(attrib),
                    from: this._generateCssAttributeValue(attrib, fromValue),
                    to: this._generateCssAttributeValue(attrib, toValue),
                    duration: duration,
                    timing: easing,
                    delay: delay,
                    toValue: toValue,
                    onEnd: onEnd,
                };
                updateTransition = true;
            }
            var transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
            if (transform) {
                if (this._animatedTransforms[transform].activeTransition) {
                    if (AppConfig_1.default.isDevelopmentMode()) {
                        console.error('Animation started while animation was already pending');
                    }
                }
                this._animatedTransforms[transform].activeTransition = {
                    property: transform,
                    from: fromValue,
                    to: toValue,
                    duration: duration,
                    timing: easing,
                    delay: delay,
                    toValue: toValue,
                    onEnd: onEnd,
                };
                updateTransition = true;
            }
            if (updateTransition) {
                this._updateTransition();
            }
        };
        // Stops a pending transition, returning the value at the current time.
        AnimatedComponentGenerated.prototype.stopTransition = function (valueObject) {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }
            var partialValue;
            var stoppedTransition;
            var updateTransition = false;
            var attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                var activeTransition = this._animatedAttributes[attrib].activeTransition;
                if (activeTransition) {
                    partialValue = activeTransition.toValue;
                    // We don't currently support updating to an intermediate
                    // value for interpolated values because this would involve
                    // mapping the interpolated value in reverse. Instead, we'll
                    // simply update it to the "toValue".
                    if (!valueObject._isInterpolated()) {
                        var domNode = this._getDomNode();
                        if (domNode) {
                            var computedStyle = window.getComputedStyle(domNode, undefined);
                            if (computedStyle && computedStyle[attrib]) {
                                partialValue = computedStyle[attrib];
                            }
                        }
                    }
                    stoppedTransition = this._animatedAttributes[attrib].activeTransition;
                    delete this._animatedAttributes[attrib].activeTransition;
                    updateTransition = true;
                }
            }
            else {
                var transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
                if (transform) {
                    var activeTransition = this._animatedTransforms[transform].activeTransition;
                    if (activeTransition) {
                        // We don't currently support updating to an intermediate value
                        // for transform values. This is because getComputedStyle
                        // returns a transform matrix for 'transform'. To implement this, we'd
                        // need to convert the matrix back to a rotation, scale, etc.
                        partialValue = activeTransition.toValue;
                        stoppedTransition = this._animatedTransforms[transform].activeTransition;
                        delete this._animatedTransforms[transform].activeTransition;
                        updateTransition = true;
                    }
                }
            }
            if (stoppedTransition && stoppedTransition.onEnd) {
                stoppedTransition.onEnd({ finished: false });
            }
            if (updateTransition) {
                this._updateTransition();
            }
            return partialValue;
        };
        AnimatedComponentGenerated.prototype._getDomNode = function () {
            return ReactDOM.findDOMNode(this._mountedComponent);
        };
        // Looks for the specified value object in the specified map. Returns
        // the key for the map (i.e. the attribute name) if found.
        AnimatedComponentGenerated.prototype._findAnimatedAttributeByValue = function (map, valueObj) {
            var keys = _.keys(map);
            var index = _.findIndex(keys, function (key) { return map[key].valueObject === valueObj; });
            return index >= 0 ? keys[index] : undefined;
        };
        // Updates the "transform" CSS attribute for the element to reflect all
        // active transitions.
        AnimatedComponentGenerated.prototype._updateTransition = function () {
            var _this = this;
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }
            var activeTransitions = [];
            _.each(this._animatedAttributes, function (attrib) {
                if (attrib.activeTransition) {
                    activeTransitions.push(attrib.activeTransition);
                }
            });
            // If there are any transform transitions, we need to combine
            // these into a single transition. That means we can't specify
            // different durations, delays or easing functions for each. That's
            // an unfortunate limitation of CSS.
            var keys = _.keys(this._animatedTransforms);
            var index = _.findIndex(keys, function (key) { return !!_this._animatedTransforms[key].activeTransition; });
            if (index >= 0) {
                var transformTransition = this._animatedTransforms[keys[index]].activeTransition;
                activeTransitions.push({
                    property: 'transform',
                    from: this._generateCssTransformList(false),
                    to: this._generateCssTransformList(true),
                    duration: transformTransition.duration,
                    timing: transformTransition.timing,
                    delay: transformTransition.delay,
                });
            }
            if (activeTransitions.length > 0) {
                var domNode = this._getDomNode();
                if (domNode) {
                    (0, executeTransition_1.executeTransition)(domNode, activeTransitions, function () {
                        // Clear all of the active transitions and invoke the onEnd callbacks.
                        var completeTransitions = [];
                        _.each(_this._animatedAttributes, function (attrib) {
                            if (attrib.activeTransition) {
                                completeTransitions.push(attrib.activeTransition);
                                delete attrib.activeTransition;
                            }
                        });
                        _.each(_this._animatedTransforms, function (transform) {
                            if (transform.activeTransition) {
                                completeTransitions.push(transform.activeTransition);
                                delete transform.activeTransition;
                            }
                        });
                        _.each(completeTransitions, function (transition) {
                            if (transition.onEnd) {
                                transition.onEnd({ finished: true });
                            }
                        });
                    });
                }
            }
        };
        // Generates the CSS value for the specified attribute given
        // an animated value object.
        AnimatedComponentGenerated.prototype._generateCssAttributeValue = function (attrib, newValue) {
            // If the value is a raw number, append the default units.
            // If it's a string, we assume the caller has specified the units.
            if (typeof newValue === 'number') {
                newValue = newValue + animatedPropUnits[attrib];
            }
            return newValue;
        };
        AnimatedComponentGenerated.prototype._generateCssTransformValue = function (transform, newValue) {
            // If the value is a raw number, append the default units.
            // If it's a string, we assume the caller has specified the units.
            if (typeof newValue === 'number') {
                newValue = newValue + animatedPropUnits[transform];
            }
            return newValue;
        };
        // Regenerates the list of transforms, combining all static and animated transforms.
        AnimatedComponentGenerated.prototype._generateCssTransformList = function (useActiveValues) {
            var _this = this;
            var transformList = [];
            _.each(this._staticTransforms, function (value, transform) {
                transformList.push(transform + '(' + value + ')');
            });
            _.each(this._animatedTransforms, function (value, transform) {
                var newValue = useActiveValues && value.activeTransition ?
                    value.activeTransition.to : value.valueObject._getOutputValue();
                transformList.push(transform + '(' + _this._generateCssTransformValue(transform, newValue) + ')');
            });
            return transformList.join(' ');
        };
        // Typing of `any` on StyleRuleSet isn't desirable, but there's not accurate typings that can be used to represent
        // our merging of web/RX styles here here
        AnimatedComponentGenerated.prototype._updateStyles = function (props) {
            var _this = this;
            this._propsWithoutStyle = _.omit(props, 'style');
            var rawStyles = Styles_1.default.combine(props.style || {});
            this._processedStyle = {};
            var newAnimatedAttributes = {};
            for (var attrib in rawStyles) {
                // Handle transforms separately.
                if (attrib === 'staticTransforms' || attrib === 'animatedTransforms') {
                    continue;
                }
                // Is this a dynamic (animated) value?
                if (rawStyles[attrib] instanceof Value) {
                    var valueObj = rawStyles[attrib];
                    this._processedStyle[attrib] = this._generateCssAttributeValue(attrib, valueObj._getOutputValue());
                    newAnimatedAttributes[attrib] = valueObj;
                }
                else {
                    // Copy the static style value.
                    this._processedStyle[attrib] = rawStyles[attrib];
                }
            }
            // Handle transforms, which require special processing because they need to
            // be combined into a single 'transform' CSS attribute.
            this._staticTransforms = rawStyles.staticTransforms || {};
            var newAnimatedTransforms = rawStyles.animatedTransforms || {};
            // Update this._animatedAttributes and this._animatedTransforms so they match
            // the updated style.
            // Remove any previous animated attributes that are no longer present
            // or associated with different value objects.
            _.each(this._animatedAttributes, function (value, attrib) {
                if (!newAnimatedAttributes[attrib] || newAnimatedAttributes[attrib] !== value.valueObject) {
                    if (value.activeTransition) {
                        if (AppConfig_1.default.isDevelopmentMode()) {
                            console.error('Animated style attribute removed while the animation was active');
                        }
                    }
                    value.valueObject._removeListener(_this);
                    delete _this._animatedAttributes[attrib];
                }
            });
            // Add new animated attributes.
            _.each(newAnimatedAttributes, function (value, attrib) {
                if (!_this._animatedAttributes[attrib]) {
                    _this._animatedAttributes[attrib] = { valueObject: value };
                    if (_this._mountedComponent) {
                        value._addListener(_this);
                    }
                }
            });
            // Remove any previous animated transforms that are no longer present
            // or associated with different value objects.
            _.each(this._animatedTransforms, function (value, transform) {
                if (!newAnimatedTransforms[transform] || newAnimatedTransforms[transform] !== value.valueObject) {
                    if (value.activeTransition) {
                        if (AppConfig_1.default.isDevelopmentMode()) {
                            console.warn('Should not remove an animated transform attribute while the animation is active');
                        }
                    }
                    value.valueObject._removeListener(_this);
                    delete _this._animatedTransforms[transform];
                }
            });
            // Add new animated transforms.
            _.each(newAnimatedTransforms, function (value, transform) {
                if (!_this._animatedTransforms[transform]) {
                    _this._animatedTransforms[transform] = { valueObject: value };
                    if (_this._mountedComponent) {
                        value._addListener(_this);
                    }
                }
            });
            // Update the transform attribute in this._processedStyle.
            var transformList = this._generateCssTransformList(true);
            if (transformList) {
                this._processedStyle.transform = transformList;
            }
        };
        AnimatedComponentGenerated.prototype.componentDidMount = function () {
            var _this = this;
            _.each(this._animatedAttributes, function (value) {
                value.valueObject._addListener(_this);
            });
            _.each(this._animatedTransforms, function (value) {
                value.valueObject._addListener(_this);
            });
        };
        AnimatedComponentGenerated.prototype.componentWillUnmount = function () {
            var _this = this;
            _.each(this._animatedAttributes, function (value) {
                value.valueObject._removeListener(_this);
            });
            this._animatedAttributes = {};
            _.each(this._animatedTransforms, function (value) {
                value.valueObject._removeListener(_this);
            });
            this._animatedTransforms = {};
        };
        AnimatedComponentGenerated.prototype.focus = function () {
            if (this._mountedComponent && this._mountedComponent.focus) {
                this._mountedComponent.focus();
            }
        };
        AnimatedComponentGenerated.prototype.requestFocus = function () {
            if (this._mountedComponent && this._mountedComponent.requestFocus) {
                this._mountedComponent.requestFocus();
            }
        };
        AnimatedComponentGenerated.prototype.blur = function () {
            if (this._mountedComponent && this._mountedComponent.blur) {
                this._mountedComponent.blur();
            }
        };
        AnimatedComponentGenerated.prototype.setFocusRestricted = function (restricted) {
            if (this._mountedComponent && this._mountedComponent.setFocusRestricted) {
                this._mountedComponent.setFocusRestricted(restricted);
            }
        };
        AnimatedComponentGenerated.prototype.setFocusLimited = function (limited) {
            if (this._mountedComponent && this._mountedComponent.setFocusLimited) {
                this._mountedComponent.setFocusLimited(limited);
            }
        };
        AnimatedComponentGenerated.prototype.render = function () {
            return (React.createElement(Component, __assign({ style: this._processedStyle }, this._propsWithoutStyle, { ref: this._onMount }), this.props.children));
        };
        // Update the component's display name for easy debugging in react devtools extension
        AnimatedComponentGenerated.displayName = "Animated." + (Component.displayName || Component.name || 'Component');
        return AnimatedComponentGenerated;
    }(React.Component));
    return AnimatedComponentGenerated;
}
exports.Image = createAnimatedComponent(Image_1.default);
exports.Text = createAnimatedComponent(Text_1.default);
exports.TextInput = createAnimatedComponent(TextInput_1.default);
exports.View = createAnimatedComponent(View_1.default);
var createValue = function (initialValue) {
    return new Value(initialValue);
};
exports.createValue = createValue;
var interpolate = function (value, inputRange, outputRange) {
    return value.interpolate({ inputRange: inputRange, outputRange: outputRange });
};
exports.interpolate = interpolate;
