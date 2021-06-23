"use strict";
/**
 * AppConfig.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A simple class to store application config.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
var AppConfig = /** @class */ (function () {
    function AppConfig() {
        this._isDebug = false;
        this._isDevelopment = false;
    }
    AppConfig.prototype.setAppConfig = function (isDebug, isDevelopment) {
        this._isDebug = isDebug;
        this._isDevelopment = isDevelopment;
    };
    AppConfig.prototype.isDebugMode = function () {
        return this._isDebug;
    };
    AppConfig.prototype.isDevelopmentMode = function () {
        return this._isDevelopment;
    };
    return AppConfig;
}());
exports.AppConfig = AppConfig;
exports.default = new AppConfig();
