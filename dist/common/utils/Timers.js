"use strict";
/**
 * Timers.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Utility functions for creating timers. We wrap the normal
 * global timer methods because they are defined in both
 * the node and lib type definition files, and the definitions
 * don't match. Depending on which one TypeScript picks up,
 * we can get compiler errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var timerProvider = typeof window !== 'undefined' ? window : global;
var Timers = /** @class */ (function () {
    function Timers() {
    }
    Timers.clearInterval = function (handle) {
        timerProvider.clearInterval(handle);
    };
    Timers.clearTimeout = function (handle) {
        timerProvider.clearTimeout(handle);
    };
    Timers.setInterval = function (handler, timeout) {
        return timerProvider.setInterval(handler, timeout);
    };
    Timers.setTimeout = function (handler, timeout) {
        return timerProvider.setTimeout(handler, timeout);
    };
    return Timers;
}());
exports.default = Timers;
