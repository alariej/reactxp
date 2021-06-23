"use strict";
/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A base class for the Web-specific implementation of the cross-platform View abstraction.
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
exports.ViewBase = void 0;
var AppConfig_1 = require("../common/AppConfig");
var RX = require("../common/Interfaces");
var PromiseDefer_1 = require("../common/utils/PromiseDefer");
var Timers_1 = require("../common/utils/Timers");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var _ = require("./utils/lodashMini");
// We create a periodic timer to detect layout changes that are performed behind
// our back by the browser's layout engine. We do this more aggressively when
// the app is known to be active and in the foreground.
var _layoutTimerActiveDuration = 1000;
var _layoutTimerInactiveDuration = 10000;
var ViewBase = /** @class */ (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isMounted = false;
        _this._isPopupDisplayed = false;
        _this._lastX = 0;
        _this._lastY = 0;
        _this._lastWidth = 0;
        _this._lastHeight = 0;
        return _this;
    }
    // Sets the activation state so we can stop our periodic timer
    // when the app is in the background.
    ViewBase.setActivationState = function (newState) {
        if (ViewBase._appActivationState !== newState) {
            ViewBase._appActivationState = newState;
            // Cancel any existing timers.
            if (ViewBase._viewCheckingTimer) {
                Timers_1.default.clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = undefined;
            }
            if (ViewBase._viewCheckingList.length > 0) {
                // If we're becoming active, check and report layout changes immediately.
                if (newState === RX.Types.AppActivationState.Active) {
                    ViewBase._checkViews();
                }
                ViewBase._viewCheckingTimer = Timers_1.default.setInterval(ViewBase._checkViews, newState === RX.Types.AppActivationState.Active ?
                    _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
            }
        }
    };
    ViewBase.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        if (!!this.props.onLayout !== !!nextProps.onLayout) {
            if (this.props.onLayout) {
                this._checkViewCheckerUnbuild();
            }
            if (nextProps.onLayout) {
                this._checkViewCheckerBuild();
            }
        }
    };
    ViewBase._checkViews = function () {
        _.each(ViewBase._viewCheckingList, function (view) {
            view._checkAndReportLayout().catch(function (e) {
                console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
            });
        });
    };
    ViewBase._reportLayoutChange = function (func) {
        this._layoutReportList.push(func);
        if (!ViewBase._layoutReportingTimer) {
            ViewBase._layoutReportingTimer = Timers_1.default.setTimeout(function () {
                ViewBase._layoutReportingTimer = undefined;
                ViewBase._reportDeferredLayoutChanges();
            }, 0);
        }
    };
    ViewBase._reportDeferredLayoutChanges = function () {
        var reportList = this._layoutReportList;
        this._layoutReportList = [];
        _.each(reportList, function (func) {
            try {
                func();
            }
            catch (e) {
                if (AppConfig_1.default.isDevelopmentMode()) {
                    console.error('Caught exception on onLayout response: ', e);
                }
            }
        });
    };
    // Returns a promise to indicate when firing of onLayout event has completed (if any)
    ViewBase.prototype._checkAndReportLayout = function () {
        var _this = this;
        if (!this._isMounted) {
            return Promise.resolve(void 0);
        }
        var container = this._getContainer();
        if (!container) {
            return Promise.resolve(void 0);
        }
        var newX = container.offsetLeft;
        var newY = container.offsetTop;
        var marginTop = !container.style.marginTop ? 0 : parseInt(container.style.marginTop, 10) || 0;
        var marginBottom = !container.style.marginBottom ? 0 : parseInt(container.style.marginBottom, 10) || 0;
        var marginRight = !container.style.marginRight ? 0 : parseInt(container.style.marginRight, 10) || 0;
        var marginLeft = !container.style.marginLeft ? 0 : parseInt(container.style.marginLeft, 10) || 0;
        var newWidth = container.offsetWidth + marginRight + marginLeft;
        var newHeight = container.offsetHeight + marginTop + marginBottom;
        if (this._lastX !== newX || this._lastY !== newY || this._lastWidth !== newWidth || this._lastHeight !== newHeight) {
            this._lastX = newX;
            this._lastY = newY;
            this._lastWidth = newWidth;
            this._lastHeight = newHeight;
            var deferred_1 = new PromiseDefer_1.Defer();
            ViewBase._reportLayoutChange(function () {
                if (!_this._isMounted || !_this.props.onLayout) {
                    deferred_1.resolve(void 0);
                    return;
                }
                _this.props.onLayout({
                    x: newX,
                    y: newY,
                    width: _this._lastWidth,
                    height: _this._lastHeight,
                });
                deferred_1.resolve(void 0);
            });
            return deferred_1.promise();
        }
        return Promise.resolve(void 0);
    };
    ViewBase.prototype._checkViewCheckerBuild = function () {
        // Enable the timer to check for layout changes. Use a different duration
        // when the app is active versus inactive.
        if (!ViewBase._viewCheckingTimer) {
            ViewBase._viewCheckingTimer = Timers_1.default.setInterval(ViewBase._checkViews, ViewBase._appActivationState === RX.Types.AppActivationState.Active ?
                _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
        }
        if (!ViewBase._isResizeHandlerInstalled) {
            window.addEventListener('resize', ViewBase._onResize);
            ViewBase._isResizeHandlerInstalled = true;
        }
        ViewBase._viewCheckingList.push(this);
    };
    ViewBase.prototype._checkViewCheckerUnbuild = function () {
        var _this = this;
        ViewBase._viewCheckingList = _.filter(ViewBase._viewCheckingList, function (v) { return v !== _this; });
        if (ViewBase._viewCheckingList.length === 0) {
            if (ViewBase._viewCheckingTimer) {
                Timers_1.default.clearInterval(ViewBase._viewCheckingTimer);
                ViewBase._viewCheckingTimer = undefined;
            }
            if (ViewBase._isResizeHandlerInstalled) {
                window.removeEventListener('resize', ViewBase._onResize);
                ViewBase._isResizeHandlerInstalled = false;
            }
        }
    };
    ViewBase.prototype.componentDidMount = function () {
        this._isMounted = true;
        if (this.props.onLayout) {
            this._checkViewCheckerBuild();
        }
        // Chain through to the same render-checking code
        this.componentDidUpdate();
    };
    ViewBase.prototype.componentDidUpdate = function () {
        var _this = this;
        var isPopupDisplayed = FrontLayerViewManager_1.default.isPopupDisplayed();
        if (this.props.onLayout) {
            if (isPopupDisplayed && !this._isPopupDisplayed) {
                // A popup was just added to DOM. Checking layout now would stall script
                // execution because the browser would have to do a reflow. Avoid that
                // by deferring the work.
                setTimeout(function () {
                    _this._checkAndReportLayout().catch(function (e) {
                        console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
                    });
                }, 0);
            }
            else {
                this._checkAndReportLayout().catch(function (e) {
                    console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
                });
            }
        }
        this._isPopupDisplayed = isPopupDisplayed;
    };
    ViewBase._onResize = function () {
        // Often views change size in response to an overall window resize. Rather than
        // wait for the next timer to fire, do it immediately.
        ViewBase._checkViews();
    };
    ViewBase.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this.props.onLayout) {
            this._checkViewCheckerUnbuild();
        }
    };
    ViewBase._isResizeHandlerInstalled = false;
    ViewBase._viewCheckingList = [];
    ViewBase._appActivationState = RX.Types.AppActivationState.Active;
    ViewBase._layoutReportList = [];
    return ViewBase;
}(RX.ViewBase));
exports.ViewBase = ViewBase;
exports.default = ViewBase;
