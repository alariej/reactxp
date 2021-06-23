"use strict";
/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Clipboard abstraction.
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
exports.Clipboard = void 0;
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Clipboard = /** @class */ (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Clipboard.prototype.setText = function (text) {
        RN.Clipboard.setString(text);
    };
    Clipboard.prototype.getText = function () {
        return RN.Clipboard.getString();
    };
    return Clipboard;
}(RX.Clipboard));
exports.Clipboard = Clipboard;
exports.default = new Clipboard();
