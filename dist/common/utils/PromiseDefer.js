"use strict";
/**
 * PromiseDefer.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Creates a deferral object that wraps promises with easier to use type-safety
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defer = void 0;
var Timers_1 = require("./Timers");
var Defer = /** @class */ (function () {
    function Defer() {
        var _this = this;
        this._promise = new Promise(function (res, rej) {
            _this._resolver = res;
            _this._rejector = rej;
        });
    }
    Defer.prototype.resolve = function (value) {
        var _this = this;
        // Resolver shouldn't be undefined, but it's technically possible
        if (!this._resolver) {
            Timers_1.default.setTimeout(function () {
                _this.resolve(value);
            }, 10);
            return;
        }
        this._resolver(value);
    };
    Defer.prototype.reject = function (value) {
        var _this = this;
        // Rejector shouldn't be undefined, but it's technically possible
        if (!this._rejector) {
            Timers_1.default.setTimeout(function () {
                _this.reject(value);
            }, 10);
            return;
        }
        this._rejector(value);
    };
    Defer.prototype.promise = function () {
        return this._promise;
    };
    return Defer;
}());
exports.Defer = Defer;
