"use strict";
/**
 * PopupContainerView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The view containing the Popup to show. This view does its own position
 * calculation on rendering as directed by position instructions received
 * through properties.
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
exports.PopupContainerView = void 0;
var React = require("react");
var RN = require("react-native");
var assert_1 = require("../common/assert");
var Interfaces_1 = require("../common/Interfaces");
var PopupContainerViewBase_1 = require("../common/PopupContainerViewBase");
var Timers_1 = require("../common/utils/Timers");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var International_1 = require("./International");
var lodashMini_1 = require("./utils/lodashMini");
var UserInterface_1 = require("./UserInterface");
var PopupContainerView = /** @class */ (function (_super) {
    __extends(PopupContainerView, _super);
    function PopupContainerView(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._viewHandle = null;
        _this._onMount = function (component) {
            _this._mountedComponent = component || undefined;
        };
        _this.state = _this._getInitialState();
        return _this;
    }
    PopupContainerView.prototype._getInitialState = function () {
        return {
            isMeasuringPopup: true,
            anchorPosition: 'left',
            anchorOffset: 0,
            popupY: 0,
            popupX: 0,
            popupWidth: 0,
            popupHeight: 0,
            constrainedPopupWidth: 0,
            constrainedPopupHeight: 0,
        };
    };
    PopupContainerView.prototype.UNSAFE_componentWillReceiveProps = function (prevProps) {
        if (this.props.popupOptions !== prevProps.popupOptions) {
            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    };
    PopupContainerView.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (this.props.popupOptions && !this.props.hidden) {
            this._recalcPosition();
            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }
        }
        else {
            this._stopRepositionPopupTimer();
        }
    };
    PopupContainerView.prototype.componentDidMount = function () {
        if (this._mountedComponent) {
            this._viewHandle = RN.findNodeHandle(this._mountedComponent);
        }
        if (this.props.popupOptions && !this.props.hidden) {
            this._recalcPosition();
            this._startRepositionPopupTimer();
        }
    };
    PopupContainerView.prototype.componentWillUnmount = function () {
        this._stopRepositionPopupTimer();
    };
    PopupContainerView.prototype.render = function () {
        var popupView = (this.props.hidden ?
            this.props.popupOptions.renderPopup('top', 0, 0, 0) :
            this.props.popupOptions.renderPopup(this.state.anchorPosition, this.state.anchorOffset, this.state.constrainedPopupWidth, this.state.constrainedPopupHeight));
        var isRTL = International_1.default.isRTL();
        var style = {
            position: 'absolute',
            top: this.state.popupY,
            right: isRTL ? this.state.popupX : undefined,
            left: !isRTL ? this.state.popupX : undefined,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            opacity: this.state.isMeasuringPopup ? 0 : 1,
            overflow: this.props.hidden ? 'hidden' : 'visible',
            width: this.props.hidden ? 0 : undefined,
            height: this.props.hidden ? 0 : undefined,
        };
        var importantForAccessibility = this.props.hidden
            ? AccessibilityUtil_1.default.importantForAccessibilityToString(Interfaces_1.Types.ImportantForAccessibility.NoHideDescendants)
            : undefined;
        return (React.createElement(RN.View, { style: style, ref: this._onMount, importantForAccessibility: importantForAccessibility }, popupView));
    };
    PopupContainerView.prototype._recalcPosition = function () {
        var _this = this;
        if (!this._mountedComponent) {
            return;
        }
        assert_1.default(!!this.props.anchorHandle);
        RN.NativeModules.UIManager.measureInWindow(this.props.anchorHandle, function (x, y, width, height) {
            if (!_this._mountedComponent) {
                return;
            }
            assert_1.default(!!_this._viewHandle);
            var anchorRect = {
                left: x, top: y, right: x + width, bottom: y + height,
                width: width, height: height
            };
            RN.NativeModules.UIManager.measureInWindow(_this._viewHandle, function (x, y, width, height) {
                var popupRect = {
                    left: x, top: y, right: x + width, bottom: y + height,
                    width: width, height: height,
                };
                _this._recalcPositionFromLayoutData(anchorRect, popupRect);
            });
        });
    };
    PopupContainerView.prototype._recalcPositionFromLayoutData = function (anchorRect, popupRect) {
        if (!this._mountedComponent) {
            return;
        }
        // If the popup hasn't been rendered yet, skip.
        if (popupRect.width <= 0 || popupRect.height <= 0) {
            return;
        }
        // Make a copy of the old state.
        var newState = lodashMini_1.extend({}, this.state);
        if (this.state.isMeasuringPopup) {
            newState.isMeasuringPopup = false;
            newState.popupWidth = popupRect.width;
            newState.popupHeight = popupRect.height;
        }
        // Get the width/height of root view window.
        var window = UserInterface_1.default.measureWindow(this.props.popupOptions.rootViewId);
        var windowDims = { width: window.width, height: window.height };
        // Run the common recalc function and see what magic it spits out.
        var result = PopupContainerViewBase_1.recalcPositionFromLayoutData(windowDims, anchorRect, popupRect, this.props.popupOptions.positionPriorities, this.props.popupOptions.useInnerPositioning);
        if (!result) {
            this._dismissPopup();
            return;
        }
        lodashMini_1.extend(newState, result);
        if (!lodashMini_1.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    };
    PopupContainerView.prototype._dismissPopup = function () {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    };
    PopupContainerView.prototype._startRepositionPopupTimer = function () {
        var _this = this;
        this._respositionPopupTimer = Timers_1.default.setInterval(function () {
            _this._recalcPosition();
        }, 1000);
    };
    PopupContainerView.prototype._stopRepositionPopupTimer = function () {
        if (this._respositionPopupTimer) {
            Timers_1.default.clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = undefined;
        }
    };
    return PopupContainerView;
}(PopupContainerViewBase_1.PopupContainerViewBase));
exports.PopupContainerView = PopupContainerView;
exports.default = PopupContainerView;
