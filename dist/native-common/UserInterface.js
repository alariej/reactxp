"use strict";
/**
 * UserInterface.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN implementation of the ReactXP interfaces related to
 * UI (layout measurements, etc.).
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
exports.UserInterface = void 0;
var React = require("react");
var RN = require("react-native");
var AppConfig_1 = require("../common/AppConfig");
var assert_1 = require("../common/assert");
var RX = require("../common/Interfaces");
var PromiseDefer_1 = require("../common/utils/PromiseDefer");
var MainViewStore_1 = require("./MainViewStore");
var UserInterface = /** @class */ (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface() {
        var _this = _super.call(this) || this;
        _this._isNavigatingWithKeyboard = false;
        _this._keyboardNavigationStateChanged = function (isNavigatingWithKeyboard) {
            _this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
        };
        RN.Dimensions.addEventListener('change', function (event) {
            _this.contentSizeMultiplierChangedEvent.fire(event.window.fontScale);
        });
        _this.keyboardNavigationEvent.subscribe(_this._keyboardNavigationStateChanged);
        _this._rootViewRegistry = {};
        return _this;
    }
    UserInterface.prototype.measureLayoutRelativeToWindow = function (component) {
        var deferred = new PromiseDefer_1.Defer();
        var nodeHandle = RN.findNodeHandle(component);
        assert_1.default(!!nodeHandle);
        RN.NativeModules.UIManager.measureInWindow(nodeHandle, function (x, y, width, height) {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height,
            });
        });
        return deferred.promise();
    };
    UserInterface.prototype.measureLayoutRelativeToAncestor = function (component, ancestor) {
        var deferred = new PromiseDefer_1.Defer();
        var nodeHandle = RN.findNodeHandle(component);
        var ancestorNodeHander = RN.findNodeHandle(ancestor);
        RN.NativeModules.UIManager.measureLayout(nodeHandle, ancestorNodeHander, function () {
            deferred.reject('UIManager.measureLayout() failed');
        }, function (x, y, width, height, pageX, pageY) {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height,
            });
        });
        return deferred.promise();
    };
    UserInterface.prototype.measureWindow = function (rootViewId) {
        var dimensions = RN.Dimensions.get('window');
        if (rootViewId && RN.Platform.OS === 'windows') {
            try {
                dimensions = RN.Dimensions.get(rootViewId);
            }
            catch (e) {
                // Can happen if RNW doesn't support multi view dimensions tracking yet
                console.warn('Couldn\'t get dimensions for rootViewId ' + rootViewId +
                    ' check if RNW already supports multi view dimensions tracking');
            }
        }
        return {
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height,
        };
    };
    UserInterface.prototype.getContentSizeMultiplier = function () {
        var deferred = new PromiseDefer_1.Defer();
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        // TODO:(alregner) Remove conditional after implementing UIManager.getContentSizeMultiplier for macos
        if (RN.Platform.OS === 'windows' || RN.Platform.OS === 'macos') {
            deferred.resolve(1);
        }
        else {
            deferred.resolve(RN.PixelRatio.getFontScale());
        }
        return deferred.promise();
    };
    UserInterface.prototype.useCustomScrollbars = function (enable) {
        if (enable === void 0) { enable = true; }
        // Nothing to do
    };
    UserInterface.prototype.dismissKeyboard = function () {
        var _a;
        // @ts-ignore
        var focusedInput = RN.TextInput.State.currentlyFocusedInput();
        (_a = focusedInput === null || focusedInput === void 0 ? void 0 : focusedInput.getNativeRef()) === null || _a === void 0 ? void 0 : _a.blur();
    };
    UserInterface.prototype.isHighPixelDensityScreen = function () {
        var ratio = RN.PixelRatio.get();
        var isHighDef = ratio > 1;
        return isHighDef;
    };
    UserInterface.prototype.getPixelRatio = function () {
        return RN.PixelRatio.get();
    };
    UserInterface.prototype.setMainView = function (element) {
        MainViewStore_1.default.setMainView(element);
    };
    UserInterface.prototype.registerRootViewUsingPropsFactory = function (factory) {
        this._rootViewUsingPropsFactory = factory;
    };
    UserInterface.prototype.registerRootView = function (viewKey, getComponentFunc) {
        if (this._rootViewUsingPropsFactory) {
            var RootViewUsingProps_1 = this._rootViewUsingPropsFactory();
            RN.AppRegistry.registerComponent(viewKey, function () {
                var RootViewWrapper = /** @class */ (function (_super) {
                    __extends(RootViewWrapper, _super);
                    function RootViewWrapper() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RootViewWrapper.prototype.render = function () {
                        return (React.createElement(RootViewUsingProps_1, __assign({ reactxp_mainViewType: getComponentFunc() }, this.props)));
                    };
                    return RootViewWrapper;
                }(React.Component));
                return RootViewWrapper;
            });
        }
    };
    UserInterface.prototype.renderMainView = function () {
        // Nothing to do
    };
    UserInterface.prototype.enableTouchLatencyEvents = function (latencyThresholdMs) {
        this._touchLatencyThresholhdMs = latencyThresholdMs;
    };
    UserInterface.prototype.evaluateTouchLatency = function (e) {
        if (this._touchLatencyThresholhdMs) {
            var latency = Date.now() - e.timeStamp.valueOf();
            if (latency > this._touchLatencyThresholhdMs) {
                this.touchLatencyEvent.fire(latency);
            }
        }
    };
    UserInterface.prototype.isNavigatingWithKeyboard = function () {
        return this._isNavigatingWithKeyboard;
    };
    UserInterface.prototype.notifyRootViewInstanceCreated = function (rootViewId, nodeHandle) {
        if (AppConfig_1.default.isDevelopmentMode()) {
            var existing = this.findNodeHandleByRootViewId(rootViewId);
            if (existing && existing !== nodeHandle) {
                console.warn('Duplicate reactxp_rootViewId!');
            }
        }
        this._rootViewRegistry[rootViewId] = nodeHandle;
    };
    UserInterface.prototype.notifyRootViewInstanceDestroyed = function (rootViewId) {
        delete this._rootViewRegistry[rootViewId];
    };
    UserInterface.prototype.findNodeHandleByRootViewId = function (rootViewId) {
        return this._rootViewRegistry[rootViewId];
    };
    return UserInterface;
}(RX.UserInterface));
exports.UserInterface = UserInterface;
exports.default = new UserInterface();
