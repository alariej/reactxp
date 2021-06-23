"use strict";
/**
 * ScrollViewConfig.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific scroll view configuration, required to avoid circular
 * dependency between application and ScrollView.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollViewConfig = void 0;
var ScrollViewConfig = /** @class */ (function () {
    function ScrollViewConfig() {
        this._useCustomScrollbars = false;
    }
    // Enable native scrollbars for all instances.
    ScrollViewConfig.prototype.setUseCustomScrollbars = function (value) {
        this._useCustomScrollbars = value;
    };
    ScrollViewConfig.prototype.useCustomScrollbars = function () {
        return this._useCustomScrollbars;
    };
    return ScrollViewConfig;
}());
exports.ScrollViewConfig = ScrollViewConfig;
exports.default = new ScrollViewConfig();
