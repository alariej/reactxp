"use strict";
/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform GestureView component.
 * It provides support for the scroll wheel, clicks and double clicks.
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
exports.GestureView = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var ReactDOM = require("react-dom");
var GestureView_1 = require("../common/GestureView");
var Interfaces_1 = require("../common/Interfaces");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var lodashMini_1 = require("./utils/lodashMini");
var MouseResponder_1 = require("./utils/MouseResponder");
var Styles_1 = require("./Styles");
// Cast to any to allow merging of web and RX styles
var _styles = {
    defaultView: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
};
// Unique to web
var _preferredPanRatio = 3;
var _idCounter = 1;
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._id = _idCounter++;
        _this._isMounted = false;
        _this._pendingMouseGestureType = GestureView_1.GestureType.None;
        _this._gestureTypeLocked = false;
        _this._setContainerRef = function (container) {
            // safe since div refs resolve into HTMLElement and not react element.
            _this._container = container;
            if (container) {
                _this._createMouseResponder(container);
            }
            else {
                _this._disposeMouseResponder();
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.props.onPan || _this.props.onPanHorizontal || _this.props.onPanVertical) {
                // Disable mousedown default action that initiates a drag/drop operation and breaks panning with a not-allowed cursor.
                // https://w3c.github.io/uievents/#mousedown
                e.preventDefault();
            }
            if (_this.props.onLongPress) {
                var gsState = _this._mouseEventToTapGestureState(e);
                _this._startLongPressTimer(gsState, true);
            }
        };
        _this._onClick = function (e) {
            _this._cancelLongPressTimer();
            var gsState = _this._mouseEventToTapGestureState(e);
            if (!_this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                _this._sendTapEvent(gsState);
            }
            else if (_this._isDoubleTap(gsState)) {
                // This is a double-tap, so swallow the previous single tap.
                _this._cancelDoubleTapTimer();
                _this._sendDoubleTapEvent(gsState);
            }
            else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                _this._reportDelayedTap();
                _this._startDoubleTapTimer(gsState);
            }
        };
        _this._sendContextMenuEvent = function (e) {
            if (_this.props.onContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                var tapEvent = _this._mouseEventToTapGestureState(e);
                _this.props.onContextMenu(tapEvent);
            }
        };
        _this._onTouchStart = function (e) {
            if (!_this._initialTouch) {
                var ft = e.touches[0];
                _this._initialTouch = { x: ft.clientX, y: ft.clientY };
                _this._ongoingGesture = { dx: 0, dy: 0, vx: 0, vy: 0 };
                _this._onTouchSeriesStart(GestureView._reactTouchEventToBasic(e));
            }
        };
        _this._onTouchMove = function (e) {
            if (!_this._initialTouch || !_this._ongoingGesture) {
                return;
            }
            var ft = e.touches[0];
            _this._ongoingGesture = {
                dx: ft.clientX - _this._initialTouch.x,
                dy: ft.clientY - _this._initialTouch.y,
                // TODO: calculate velocity?
                vx: 0,
                vy: 0,
            };
            _this._onTouchChange(GestureView._reactTouchEventToBasic(e), _this._ongoingGesture);
        };
        _this._onTouchEnd = function (e) {
            if (!_this._initialTouch || !_this._ongoingGesture) {
                return;
            }
            if (e.touches.length === 0) {
                _this._onTouchSeriesFinished(GestureView._reactTouchEventToBasic(e), _this._ongoingGesture);
                _this._initialTouch = undefined;
                _this._ongoingGesture = undefined;
            }
        };
        _this._detectGestureType = function (gestureState) {
            // we need to lock gesture type until it's completed
            if (_this._gestureTypeLocked) {
                return _this._pendingMouseGestureType;
            }
            _this._gestureTypeLocked = true;
            var gsBasic = {
                dx: gestureState.clientX - gestureState.initialClientX,
                dy: gestureState.clientY - gestureState.initialClientY,
            };
            if (_this._shouldRespondToPan(gsBasic)) {
                return GestureView_1.GestureType.Pan;
            }
            else if (_this._shouldRespondToPanVertical(gsBasic)) {
                return GestureView_1.GestureType.PanVertical;
            }
            else if (_this._shouldRespondToPanHorizontal(gsBasic)) {
                return GestureView_1.GestureType.PanHorizontal;
            }
            _this._gestureTypeLocked = false;
            return GestureView_1.GestureType.None;
        };
        _this._onWheel = function (e) {
            if (_this.props.onScrollWheel) {
                var clientRect = _this._getGestureViewClientRect();
                if (clientRect) {
                    var scrollWheelEvent = {
                        clientX: e.clientX - clientRect.left,
                        clientY: e.clientY - clientRect.top,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        scrollAmount: e.deltaY,
                        timeStamp: e.timeStamp,
                        isTouch: false,
                    };
                    _this.props.onScrollWheel(scrollWheelEvent);
                }
            }
        };
        _this._sendMousePanEvent = function (gestureState) {
            switch (_this._pendingMouseGestureType) {
                case GestureView_1.GestureType.Pan:
                    if (_this.props.onPan) {
                        _this.props.onPan(gestureState);
                    }
                    break;
                case GestureView_1.GestureType.PanVertical:
                    if (_this.props.onPanVertical) {
                        _this.props.onPanVertical(gestureState);
                    }
                    break;
                case GestureView_1.GestureType.PanHorizontal:
                    if (_this.props.onPanHorizontal) {
                        _this.props.onPanHorizontal(gestureState);
                    }
                    break;
                default:
                // do nothing;
            }
            // we need to clean taps in case there was a pan event in the meantime
            if (_this._pendingMouseGestureType !== GestureView_1.GestureType.None) {
                _this._clearLastTap();
                _this._cancelDoubleTapTimer();
                _this._skipNextTap();
            }
        };
        return _this;
    }
    // Get preferred pan ratio for platform.
    GestureView.prototype._getPreferredPanRatio = function () {
        return _preferredPanRatio;
    };
    // Returns the timestamp for the touch event in milliseconds.
    GestureView.prototype._getEventTimestamp = function (e) {
        return e.timeStamp;
    };
    GestureView.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    GestureView.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this._isMounted = false;
    };
    GestureView.prototype.render = function () {
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        return (React.createElement("div", { style: this._getStyles(), tabIndex: this.props.tabIndex, ref: this._setContainerRef, onMouseDown: this._onMouseDown, onClick: this._onClick, onWheel: this._onWheel, onTouchStart: this._onTouchStart, onTouchMove: this._onTouchMove, onTouchEnd: this._onTouchEnd, onFocus: this.props.onFocus, onBlur: this.props.onBlur, onKeyPress: this.props.onKeyPress, role: ariaRole, "aria-label": this.props.accessibilityLabel, "aria-hidden": isAriaHidden, onContextMenu: this.props.onContextMenu ? this._sendContextMenuEvent : undefined, "data-test-id": this.props.testId }, this.props.children));
    };
    GestureView.prototype.blur = function () {
        var el = this._getContainer();
        if (el) {
            el.blur();
        }
    };
    GestureView.prototype.focus = function () {
        var el = this._getContainer();
        if (el) {
            el.focus();
        }
    };
    GestureView.prototype._getContainer = function () {
        if (!this._isMounted) {
            return null;
        }
        try {
            return ReactDOM.findDOMNode(this);
        }
        catch (_a) {
            // Handle exception due to potential unmount race condition.
            return null;
        }
    };
    GestureView.prototype._createMouseResponder = function (container) {
        var _this = this;
        var context = this.context;
        this._disposeMouseResponder();
        this._responder = MouseResponder_1.default.create({
            id: this._id,
            target: container,
            disableWhenModal: !!context.isInRxMainView,
            shouldBecomeFirstResponder: function (event) {
                if (!_this.props.onPan && !_this.props.onPanHorizontal && !_this.props.onPanVertical) {
                    return false;
                }
                var boundingRect = _this._getGestureViewClientRect();
                if (!boundingRect) {
                    return false;
                }
                var top = boundingRect.top, left = boundingRect.left, bottom = boundingRect.bottom, right = boundingRect.right;
                var clientX = event.clientX, clientY = event.clientY;
                if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                    return true;
                }
                return false;
            },
            onMove: function (event, gestureState) {
                _this._pendingMouseGestureType = _this._detectGestureType(gestureState);
                if (_this._pendingMouseGestureType !== GestureView_1.GestureType.None) {
                    _this._cancelLongPressTimer();
                }
                _this._sendMousePanEvent(gestureState);
            },
            onTerminate: function (event, gestureState) {
                _this._cancelLongPressTimer();
                _this._pendingMouseGestureType = _this._detectGestureType(gestureState);
                _this._sendMousePanEvent(gestureState);
                _this._pendingMouseGestureType = GestureView_1.GestureType.None;
                _this._gestureTypeLocked = false;
            },
        });
    };
    GestureView.prototype._disposeMouseResponder = function () {
        if (this._responder) {
            this._responder.dispose();
            delete this._responder;
        }
    };
    GestureView.prototype._getStyles = function () {
        var combinedStyles = Styles_1.default.combine([_styles.defaultView, this.props.style]);
        var cursorName;
        switch (this.props.mouseOverCursor) {
            case Interfaces_1.Types.GestureMouseCursor.Grab:
                cursorName = 'grab';
                break;
            case Interfaces_1.Types.GestureMouseCursor.Move:
                cursorName = 'move';
                break;
            case Interfaces_1.Types.GestureMouseCursor.Pointer:
                cursorName = 'pointer';
                break;
            case Interfaces_1.Types.GestureMouseCursor.NSResize:
                cursorName = 'ns-resize';
                break;
            case Interfaces_1.Types.GestureMouseCursor.EWResize:
                cursorName = 'ew-resize';
                break;
            case Interfaces_1.Types.GestureMouseCursor.NESWResize:
                cursorName = 'nesw-resize';
                break;
            case Interfaces_1.Types.GestureMouseCursor.NWSEResize:
                cursorName = 'nwse-resize';
                break;
            case Interfaces_1.Types.GestureMouseCursor.NotAllowed:
                cursorName = 'not-allowed';
                break;
            case Interfaces_1.Types.GestureMouseCursor.ZoomIn:
                cursorName = 'zoom-in';
                break;
            case Interfaces_1.Types.GestureMouseCursor.ZoomOut:
                cursorName = 'zoom-out';
                break;
        }
        if (cursorName) {
            combinedStyles.cursor = cursorName;
        }
        return combinedStyles;
    };
    // The RN and React touch event types are basically identical except that React uses "clientX/Y"
    // and RN uses "locationX/Y", so we need to map one to the other.  Unfortunately, due to inertia,
    // web loses.  So, we need these 3 ugly functions...
    GestureView._reactTouchEventToBasic = function (e) {
        var ne = (0, lodashMini_1.clone)(e);
        ne.changedTouches = this._mapReactTouchListToBasic(e.changedTouches);
        ne.targetTouches = this._mapReactTouchListToBasic(e.targetTouches);
        ne.touches = this._mapReactTouchListToBasic(e.touches);
        var ft = ne.touches[0];
        if (ft) {
            // RN also apparently shims the first touch's location info onto the root touch event
            ne.pageX = ft.pageX;
            ne.pageY = ft.pageY;
            ne.locationX = ft.locationX;
            ne.locationY = ft.locationY;
        }
        return ne;
    };
    GestureView._mapReactTouchListToBasic = function (l) {
        var nl = new Array(l.length);
        for (var i = 0; i < l.length; i++) {
            nl[i] = this._mapReactTouchToRx(l[i]);
        }
        return nl;
    };
    GestureView._mapReactTouchToRx = function (l) {
        return {
            identifier: l.identifier,
            locationX: l.clientX,
            locationY: l.clientY,
            screenX: l.screenX,
            screenY: l.screenY,
            clientX: l.clientX,
            clientY: l.clientY,
            pageX: l.pageX,
            pageY: l.pageY,
        };
    };
    GestureView.prototype._getClientXYOffset = function () {
        var rect = this._getGestureViewClientRect();
        return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
    };
    GestureView.prototype._getGestureViewClientRect = function () {
        return this._container ? this._container.getBoundingClientRect() : null;
    };
    GestureView.contextTypes = {
        isInRxMainView: PropTypes.bool,
    };
    return GestureView;
}(GestureView_1.default));
exports.GestureView = GestureView;
exports.default = GestureView;
