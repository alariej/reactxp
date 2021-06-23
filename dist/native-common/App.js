"use strict";
/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of App API namespace.
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
exports.App = void 0;
var RN = require("react-native");
var RX = require("../common/Interfaces");
var RootView_1 = require("./RootView");
var UserInterface_1 = require("./UserInterface");
var _rnStateToRxState = {
    'unknown': RX.Types.AppActivationState.Active,
    'active': RX.Types.AppActivationState.Active,
    'background': RX.Types.AppActivationState.Background,
    'inactive': RX.Types.AppActivationState.Inactive,
    'extension': RX.Types.AppActivationState.Extension,
    // uninitialized means in Background on android since last change I did
    'uninitialized': RX.Types.AppActivationState.Background,
};
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        RN.AppState.addEventListener('change', function (newState) {
            // Fall back to active if a new state spits out that we don't know about
            _this.activationStateChangedEvent.fire(_rnStateToRxState[newState] || RX.Types.AppActivationState.Active);
        });
        RN.AppState.addEventListener('memoryWarning', function () {
            _this.memoryWarningEvent.fire();
        });
        return _this;
    }
    App.prototype.initialize = function (debug, development) {
        _super.prototype.initialize.call(this, debug, development);
        window.rxdebug = debug;
        RN.AppRegistry.registerComponent('RXApp', this.getRootViewFactory());
        UserInterface_1.default.registerRootViewUsingPropsFactory(this.getRootViewUsingPropsFactory());
    };
    App.prototype.getActivationState = function () {
        return _rnStateToRxState[RN.AppState.currentState] || RX.Types.AppActivationState.Active;
    };
    App.prototype.getRootViewFactory = function () {
        return function () { return RootView_1.RootView; };
    };
    App.prototype.getRootViewUsingPropsFactory = function () {
        return function () { return RootView_1.RootViewUsingProps; };
    };
    return App;
}(RX.App));
exports.App = App;
exports.default = new App();
