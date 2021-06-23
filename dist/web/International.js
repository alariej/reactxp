"use strict";
/**
 * International.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation for i18n.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.International = void 0;
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var International = /** @class */ (function () {
    function International() {
    }
    International.prototype.allowRTL = function (allow) {
        FrontLayerViewManager_1.default.allowRTL(allow);
    };
    International.prototype.forceRTL = function (force) {
        FrontLayerViewManager_1.default.forceRTL(force);
    };
    International.prototype.isRTL = function () {
        return FrontLayerViewManager_1.default.isRTL();
    };
    return International;
}());
exports.International = International;
exports.default = new International();
