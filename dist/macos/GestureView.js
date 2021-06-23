"use strict";
/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * MacOS-specific implementation of GestureView component.
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
exports.GestureView = void 0;
var GestureView_1 = require("../native-common/GestureView");
var _preferredPanRatio = 3;
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView(props) {
        return _super.call(this, props) || this;
    }
    GestureView.prototype._getPreferredPanRatio = function () {
        return _preferredPanRatio;
    };
    GestureView.prototype._getEventTimestamp = function (e) {
        var timestamp = e.timeStamp;
        // Work around a bug in some versions of RN where "timestamp" is
        // capitalized differently for some events.
        if (!timestamp) {
            timestamp = e.timestamp;
        }
        if (!timestamp) {
            return 0;
        }
        return timestamp.valueOf();
    };
    return GestureView;
}(GestureView_1.GestureView));
exports.GestureView = GestureView;
exports.default = GestureView;
