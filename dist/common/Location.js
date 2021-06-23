"use strict";
/**
 * Location.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Methods to fetch the user's location.
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
exports.Location = void 0;
var RX = require("./Interfaces");
var PromiseDefer_1 = require("./utils/PromiseDefer");
var Location = /** @class */ (function (_super) {
    __extends(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Location.prototype.setConfiguration = function (config) {
        if (this.isAvailable()) {
            // Work around the fact "geolocation" type definition in ES6 lib
            // doesn't declare the RN-specific setRNConfiguration setter.
            var configSetter = navigator.geolocation.setRNConfiguration;
            if (configSetter) {
                configSetter(config);
            }
        }
    };
    // Check if a geolocation service is available.
    Location.prototype.isAvailable = function () {
        return !!('geolocation' in navigator);
    };
    // Get the current location of the user. This method returns a promise that either
    // resolves to the position or rejects with an error code.
    Location.prototype.getCurrentPosition = function (options) {
        if (!this.isAvailable()) {
            var error = {
                code: RX.Types.LocationErrorType.PositionUnavailable,
                message: 'Position unavailable because device does not support it.',
                PERMISSION_DENIED: 0,
                POSITION_UNAVAILABLE: 1,
                TIMEOUT: 0,
            };
            return Promise.reject(error);
        }
        var deferred = new PromiseDefer_1.Defer();
        var reportedError = false;
        navigator.geolocation.getCurrentPosition(function (position) {
            deferred.resolve(position);
        }, function (error) {
            // We need to protect against a known bug on some platforms where
            // a timeout error is reported after other types of errors (e.g.
            // the user hasn't granted access).
            if (!reportedError) {
                deferred.reject(error);
                reportedError = true;
            }
        }, options);
        return deferred.promise();
    };
    // Get the current location of the user on a repeating basis. This method returns
    // a promise that resolves to a watcher id or rejects with an error code. If resolved,
    // future locations and errors will be piped through the provided callbacks.
    Location.prototype.watchPosition = function (successCallback, errorCallback, options) {
        if (!this.isAvailable()) {
            return Promise.reject(RX.Types.LocationErrorType.PositionUnavailable);
        }
        var watchId = navigator.geolocation.watchPosition(function (position) {
            successCallback(position);
        }, function (error) {
            if (errorCallback) {
                errorCallback(error.code);
            }
        }, options);
        return Promise.resolve(watchId);
    };
    // Clears a location watcher from watchPosition.
    Location.prototype.clearWatch = function (watchID) {
        navigator.geolocation.clearWatch(watchID);
    };
    return Location;
}(RX.Location));
exports.Location = Location;
exports.default = new Location();
