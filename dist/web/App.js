"use strict";
/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements App interface for ReactXP.
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
var RX = require("../common/Interfaces");
var AppVisibilityUtils_1 = require("./utils/AppVisibilityUtils");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this._setActivationState = function (currentState) {
            if (_this._activationState !== currentState) {
                _this._activationState = currentState;
                _this.activationStateChangedEvent.fire(_this._activationState);
            }
        };
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            _this._activationState = AppVisibilityUtils_1.default.isAppInForeground() ?
                RX.Types.AppActivationState.Active : RX.Types.AppActivationState.Background;
            AppVisibilityUtils_1.default.onAppForegroundedEvent.subscribe(function () {
                _this._setActivationState(RX.Types.AppActivationState.Active);
            });
            AppVisibilityUtils_1.default.onAppBackgroundedEvent.subscribe(function () {
                _this._setActivationState(RX.Types.AppActivationState.Background);
            });
        }
        else {
            _this._activationState = RX.Types.AppActivationState.Active;
        }
        return _this;
    }
    App.prototype.initialize = function (debug, development) {
        _super.prototype.initialize.call(this, debug, development);
    };
    App.prototype.getActivationState = function () {
        return this._activationState;
    };
    return App;
}(RX.App));
exports.App = App;
exports.default = new App();
