"use strict";
/**
 * Picker.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Picker abstraction.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Picker = void 0;
var React = require("react");
var picker_1 = require("@react-native-picker/picker");
var RX = require("../common/Interfaces");
var lodashMini_1 = require("./utils/lodashMini");
var Picker = /** @class */ (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onValueChange = function (itemValue, itemPosition) {
            _this.props.onValueChange(itemValue, itemPosition);
        };
        return _this;
    }
    Picker.prototype.render = function () {
        return (React.createElement(picker_1.Picker, { selectedValue: this.props.selectedValue, onValueChange: this.onValueChange, style: this.props.style, mode: this.props.mode, testID: this.props.testId }, (0, lodashMini_1.map)(this.props.items, function (i, idx) { return React.createElement(picker_1.Picker.Item, __assign({}, i, { key: idx })); })));
    };
    return Picker;
}(RX.Picker));
exports.Picker = Picker;
exports.default = Picker;
