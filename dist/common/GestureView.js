"use strict";
/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Cross-platform parts of the implementation of the GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
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
exports.GestureView = exports.GestureType = void 0;
var React = require("react");
var assert_1 = require("../common/assert");
var Interfaces_1 = require("../common/Interfaces");
var Timers_1 = require("../common/utils/Timers");
var GestureType;
(function (GestureType) {
    GestureType[GestureType["None"] = 0] = "None";
    GestureType[GestureType["MultiTouch"] = 1] = "MultiTouch";
    GestureType[GestureType["Pan"] = 2] = "Pan";
    GestureType[GestureType["PanVertical"] = 3] = "PanVertical";
    GestureType[GestureType["PanHorizontal"] = 4] = "PanHorizontal";
})(GestureType = exports.GestureType || (exports.GestureType = {}));
// These threshold values were chosen empirically.
var _pinchZoomPixelThreshold = 3;
var _panPixelThreshold = 10;
var _tapDurationThreshold = 500;
var _longPressDurationThreshold = 750;
var _tapPixelThreshold = 4;
var _doubleTapDurationThreshold = 250;
var _doubleTapPixelThreshold = 20;
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // State for tracking move gestures (pinch/zoom or pan)
        _this._pendingGestureType = GestureType.None;
        // Skip ability for next tap to work around some event issues
        _this._shouldSkipNextTap = false;
        // Protected only as a hack for supporting keyboard nav clicking from native-common/GestureView
        _this._sendTapEvent = function (tapEvent) {
            // we need to skip tap after succesfull pan event
            // mouse up would otherwise trigger both pan & tap
            if (_this._shouldSkipNextTap) {
                _this._shouldSkipNextTap = false;
                return;
            }
            var button = GestureView._toMouseButton(tapEvent);
            if (button === 2) {
                // Always handle secondary button, even if context menu is not set - it shouldn't trigger onTap.
                if (_this.props.onContextMenu) {
                    _this.props.onContextMenu(tapEvent);
                }
            }
            else if (_this.props.onTap) {
                _this.props.onTap(tapEvent);
            }
        };
        return _this;
    }
    GestureView.prototype.componentWillUnmount = function () {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    };
    // Returns true if we care about trapping/tracking the event
    GestureView.prototype._onTouchSeriesStart = function (event) {
        this._lastGestureStartEvent = event;
        // If we're trying to detect a tap, set this as the responder immediately.
        if (this.props.onTap || this.props.onDoubleTap || this.props.onLongPress || this.props.onContextMenu) {
            if (this.props.onLongPress) {
                var gsState = this._touchEventToTapGestureState(event);
                this._startLongPressTimer(gsState);
            }
            return true;
        }
        return false;
    };
    // Returns true if we care about trapping/tracking the event
    GestureView.prototype._onTouchChange = function (event, gestureState) {
        if (!this._lastGestureStartEvent) {
            this._lastGestureStartEvent = event;
        }
        // If this is the first movement we've seen, try to match it against
        // the various move gestures that we're looking for.
        var initializeFromEvent = false;
        if (this._pendingGestureType === GestureType.None) {
            this._pendingGestureType = this._detectMoveGesture(event, gestureState);
            initializeFromEvent = true;
        }
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._setPendingGestureState(this._sendMultiTouchEvents(event, gestureState, initializeFromEvent, false));
            return true;
        }
        else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            var spEvent = this._touchEventToTapGestureState(event);
            this._setPendingGestureState(this._sendPanEvent(spEvent, gestureState, this._pendingGestureType, initializeFromEvent, false));
            return true;
        }
        return false;
    };
    GestureView.prototype._onTouchSeriesFinished = function (touchEvent, gestureState) {
        // Can't possibly be a long press if the touch ended.
        this._cancelLongPressTimer();
        // Close out any of the pending move gestures.
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._sendMultiTouchEvents(touchEvent, gestureState, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        }
        else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            var spEvent = this._touchEventToTapGestureState(touchEvent);
            this._sendPanEvent(spEvent, gestureState, this._pendingGestureType, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        }
        else if (this._isTap(touchEvent)) {
            var tapGestureState = this._touchEventToTapGestureState(touchEvent);
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(tapGestureState);
            }
            else if (this._isDoubleTap(tapGestureState)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(tapGestureState);
            }
            else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                this._reportDelayedTap();
                this._startDoubleTapTimer(tapGestureState);
            }
        }
        else {
            this._reportDelayedTap();
            this._cancelDoubleTapTimer();
        }
    };
    GestureView.prototype._skipNextTap = function () {
        this._shouldSkipNextTap = true;
    };
    GestureView.prototype._setPendingGestureState = function (gestureState) {
        this._reportDelayedTap();
        this._cancelDoubleTapTimer();
        this._cancelLongPressTimer();
        this._pendingGestureState = gestureState;
    };
    GestureView.prototype._detectMoveGesture = function (e, gestureState) {
        if (this._shouldRespondToPinchZoom(e) || this._shouldRespondToRotate(e)) {
            return GestureType.MultiTouch;
        }
        else if (this._shouldRespondToPan(gestureState)) {
            return GestureType.Pan;
        }
        else if (this._shouldRespondToPanVertical(gestureState)) {
            return GestureType.PanVertical;
        }
        else if (this._shouldRespondToPanHorizontal(gestureState)) {
            return GestureType.PanHorizontal;
        }
        return GestureType.None;
    };
    // Determines whether a touch event constitutes a tap. The "finger up"
    // event must be within a certain distance and within a certain time
    // from where the "finger down" event occurred.
    GestureView.prototype._isTap = function (e) {
        if (!this._lastGestureStartEvent) {
            return false;
        }
        var initialTimeStamp = this._getEventTimestamp(this._lastGestureStartEvent);
        var initialPageX = this._lastGestureStartEvent.pageX;
        var initialPageY = this._lastGestureStartEvent.pageY;
        var timeStamp = this._getEventTimestamp(e);
        return (timeStamp - initialTimeStamp <= _tapDurationThreshold &&
            this._calcDistance(initialPageX - e.pageX, initialPageY - e.pageY) <= _tapPixelThreshold);
    };
    // This method assumes that the caller has already determined that two
    // taps have been detected in a row with no intervening gestures. It
    // is responsible for determining if they occurred within close proximity
    // and within a certain threshold of time.
    GestureView.prototype._isDoubleTap = function (e) {
        if (!this._lastTapEvent) {
            return false;
        }
        return (e.timeStamp - this._lastTapEvent.timeStamp <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - e.pageX, this._lastTapEvent.pageY - e.pageY) <= _doubleTapPixelThreshold);
    };
    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    GestureView.prototype._startDoubleTapTimer = function (e) {
        var _this = this;
        this._lastTapEvent = e;
        this._doubleTapTimer = Timers_1.default.setTimeout(function () {
            _this._reportDelayedTap();
            _this._doubleTapTimer = undefined;
        }, _doubleTapDurationThreshold);
    };
    // Cancels any pending double-tap timer.
    GestureView.prototype._cancelDoubleTapTimer = function () {
        if (this._doubleTapTimer) {
            Timers_1.default.clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = undefined;
        }
    };
    GestureView.prototype._startLongPressTimer = function (gsState, isDefinitelyMouse) {
        var _this = this;
        if (isDefinitelyMouse === void 0) { isDefinitelyMouse = false; }
        if (this._pendingLongPressEvent) {
            return;
        }
        this._pendingLongPressEvent = gsState;
        this._longPressTimer = Timers_1.default.setTimeout(function () {
            _this._reportLongPress();
            _this._longPressTimer = undefined;
        }, _longPressDurationThreshold);
    };
    GestureView.prototype._reportLongPress = function () {
        if (!this._pendingLongPressEvent) {
            return;
        }
        if (this.props.onLongPress) {
            this.props.onLongPress(this._pendingLongPressEvent);
        }
        this._pendingLongPressEvent = undefined;
    };
    GestureView.prototype._cancelLongPressTimer = function () {
        if (this._longPressTimer) {
            Timers_1.default.clearTimeout(this._longPressTimer);
            this._longPressTimer = undefined;
        }
        this._pendingLongPressEvent = undefined;
    };
    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    GestureView.prototype._reportDelayedTap = function () {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = undefined;
        }
    };
    GestureView.prototype._clearLastTap = function () {
        this._lastTapEvent = undefined;
    };
    GestureView._isActuallyMouseEvent = function (e) {
        if (!e) {
            return false;
        }
        var nativeEvent = e;
        if (nativeEvent.button !== undefined) {
            return true;
        }
        else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
            return true;
        }
        else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
            return true;
        }
        return false;
    };
    GestureView.prototype._shouldRespondToPinchZoom = function (e) {
        if (!this.props.onPinchZoom) {
            return false;
        }
        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }
        // Has the user started to pinch or zoom?
        var distance = this._calcDistance(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        if (distance >= _pinchZoomPixelThreshold) {
            return true;
        }
        return false;
    };
    GestureView.prototype._shouldRespondToRotate = function (e) {
        if (!this.props.onRotate) {
            return false;
        }
        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }
        return true;
    };
    GestureView.prototype._shouldRespondToPan = function (gestureState) {
        if (!this.props.onPan) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        return (this._calcDistance(gestureState.dx, gestureState.dy) >= panThreshold);
    };
    GestureView.prototype._shouldRespondToPanVertical = function (gestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        var isPan = Math.abs(gestureState.dy) >= panThreshold;
        if (isPan && this.props.preferredPan === Interfaces_1.Types.PreferredPanGesture.Horizontal) {
            return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * this._getPreferredPanRatio());
        }
        return isPan;
    };
    GestureView.prototype._shouldRespondToPanHorizontal = function (gestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        var isPan = Math.abs(gestureState.dx) >= panThreshold;
        if (isPan && this.props.preferredPan === Interfaces_1.Types.PreferredPanGesture.Vertical) {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * this._getPreferredPanRatio());
        }
        return isPan;
    };
    GestureView.prototype._calcDistance = function (dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    };
    GestureView.prototype._calcAngle = function (touches) {
        var a = touches[0];
        var b = touches[1];
        var degrees = this._radiansToDegrees(Math.atan2(b.pageY - a.pageY, b.pageX - a.pageX));
        if (degrees < 0) {
            degrees += 360;
        }
        return degrees;
    };
    GestureView.prototype._radiansToDegrees = function (rad) {
        return rad * 180 / Math.PI;
    };
    GestureView.prototype._sendMultiTouchEvents = function (e, gestureState, initializeFromEvent, isComplete) {
        var p = this._pendingGestureState;
        var multiTouchEvent;
        // If the user lifted up one or both fingers, the multitouch gesture
        // is halted. Just return the existing gesture state.
        if (!e.touches || e.touches.length !== 2) {
            multiTouchEvent = p;
            p.isComplete = isComplete;
        }
        else {
            var centerPageX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            var centerPageY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            var centerClientX = (e.touches[0].locationX + e.touches[1].locationX) / 2;
            var centerClientY = (e.touches[0].locationY + e.touches[1].locationY) / 2;
            var width = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            var height = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            var distance = this._calcDistance(width, height);
            var angle = this._calcAngle(e.touches);
            var initialCenterPageX = initializeFromEvent ? centerPageX : p.initialCenterPageX;
            var initialCenterPageY = initializeFromEvent ? centerPageY : p.initialCenterPageY;
            var initialCenterClientX = initializeFromEvent ? centerClientX : p.initialCenterClientX;
            var initialCenterClientY = initializeFromEvent ? centerClientY : p.initialCenterClientY;
            var initialWidth = initializeFromEvent ? width : p.initialWidth;
            var initialHeight = initializeFromEvent ? height : p.initialHeight;
            var initialDistance = initializeFromEvent ? distance : p.initialDistance;
            var initialAngle = initializeFromEvent ? angle : p.initialAngle;
            var velocityX = initializeFromEvent ? 0 : gestureState.vx;
            var velocityY = initializeFromEvent ? 0 : gestureState.vy;
            multiTouchEvent = {
                initialCenterPageX: initialCenterPageX,
                initialCenterPageY: initialCenterPageY,
                initialCenterClientX: initialCenterClientX,
                initialCenterClientY: initialCenterClientY,
                initialWidth: initialWidth,
                initialHeight: initialHeight,
                initialDistance: initialDistance,
                initialAngle: initialAngle,
                centerPageX: centerPageX,
                centerPageY: centerPageY,
                centerClientX: centerClientX,
                centerClientY: centerClientY,
                velocityX: velocityX,
                velocityY: velocityY,
                width: width,
                height: height,
                distance: distance,
                angle: angle,
                isComplete: isComplete,
                timeStamp: e.timeStamp,
                isTouch: !GestureView._isActuallyMouseEvent(e),
            };
        }
        if (this.props.onPinchZoom) {
            this.props.onPinchZoom(multiTouchEvent);
        }
        if (this.props.onRotate) {
            this.props.onRotate(multiTouchEvent);
        }
        return multiTouchEvent;
    };
    GestureView.prototype._touchEventToTapGestureState = function (e) {
        var pageX = e.pageX;
        var pageY = e.pageY;
        var clientX = e.locationX;
        var clientY = e.locationY;
        // Grab the first touch. If the user adds additional touch events,
        // we will ignore them. If we use e.pageX/Y, we will be using the average
        // of the touches, so we'll see a discontinuity.
        if (e.touches && e.touches.length > 0) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
            clientX = e.touches[0].locationX;
            clientY = e.touches[0].locationY;
        }
        return {
            timeStamp: this._getEventTimestamp(e),
            clientX: clientX,
            clientY: clientY,
            pageX: pageX,
            pageY: pageY,
            isTouch: !GestureView._isActuallyMouseEvent(e),
        };
    };
    GestureView.prototype._mouseEventToTapGestureState = function (e) {
        var xyOffset = this._getClientXYOffset();
        return {
            timeStamp: this._getEventTimestamp(e),
            clientX: e.clientX - xyOffset.x,
            clientY: e.clientY - xyOffset.y,
            pageX: e.pageX || 0,
            pageY: e.pageY || 0,
            isTouch: false,
        };
    };
    GestureView.prototype._getClientXYOffset = function () {
        return { x: 0, y: 0 };
    };
    GestureView.prototype._sendPanEvent = function (e, gestureState, gestureType, initializeFromEvent, isComplete) {
        var state = this._pendingGestureState;
        assert_1.default(this._lastGestureStartEvent, 'Gesture start event must not be null.');
        var initialPageX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageX
            : initializeFromEvent ? e.pageX : state.initialPageX;
        var initialPageY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageY
            : initializeFromEvent ? e.pageY : state.initialPageY;
        var initialClientX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationX
            : initializeFromEvent ? e.clientX : state.initialClientX;
        var initialClientY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationY
            : initializeFromEvent ? e.clientY : state.initialClientY;
        var velocityX = initializeFromEvent ? 0 : gestureState.vx;
        var velocityY = initializeFromEvent ? 0 : gestureState.vy;
        var panEvent = {
            initialPageX: initialPageX,
            initialPageY: initialPageY,
            initialClientX: initialClientX,
            initialClientY: initialClientY,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            velocityX: velocityX,
            velocityY: velocityY,
            isComplete: isComplete,
            timeStamp: e.timeStamp,
            isTouch: !GestureView._isActuallyMouseEvent(this._lastGestureStartEvent),
        };
        switch (gestureType) {
            case GestureType.Pan:
                if (this.props.onPan) {
                    this.props.onPan(panEvent);
                }
                break;
            case GestureType.PanVertical:
                if (this.props.onPanVertical) {
                    this.props.onPanVertical(panEvent);
                }
                break;
            case GestureType.PanHorizontal:
                if (this.props.onPanHorizontal) {
                    this.props.onPanHorizontal(panEvent);
                }
                break;
            default:
            // do nothing;
        }
        return panEvent;
    };
    GestureView._toMouseButton = function (nativeEvent) {
        if (nativeEvent.button !== undefined) {
            return nativeEvent.button;
        }
        else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
            return 2;
        }
        else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
            return 1;
        }
        return 0;
    };
    GestureView.prototype._sendDoubleTapEvent = function (e) {
        // If user did a double click with different mouse buttons, eg. left (50ms) right
        // both clicks need to be registered as separate events.
        var lastButton = GestureView._toMouseButton(this._lastTapEvent);
        var button = GestureView._toMouseButton(e);
        if (lastButton !== button || button === 2) {
            this._sendTapEvent(this._lastTapEvent);
            return;
        }
        if (this.props.onDoubleTap) {
            this.props.onDoubleTap(e);
        }
        this._lastTapEvent = undefined;
    };
    return GestureView;
}(React.Component));
exports.GestureView = GestureView;
exports.default = GestureView;
