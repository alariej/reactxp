"use strict";
/**
 * Picker.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Select abstraction.
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
exports.Picker = void 0;
var React = require("react");
var RX = require("../common/Interfaces");
var _ = require("./utils/lodashMini");
var Styles_1 = require("./Styles");
var Picker = /** @class */ (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onValueChange = function (e) {
            var selectEl = e.target;
            var selectedValue = selectEl.value;
            var selectedItemPosition = _.findIndex(_this.props.items, function (i) { return i.value === selectedValue; });
            _this.props.onValueChange(selectedValue, selectedItemPosition);
        };
        return _this;
    }
    Picker.prototype.render = function () {
        return (React.createElement("select", { style: this._getStyles(), value: this.props.selectedValue, onChange: this._onValueChange, "data-test-id": this.props.testId }, _.map(this.props.items, function (i, idx) { return React.createElement("option", { value: i.value, key: idx }, i.label); })));
    };
    Picker.prototype._getStyles = function () {
        return Styles_1.default.combine(this.props.style);
    };
    return Picker;
}(RX.Picker));
exports.Picker = Picker;
exports.default = Picker;
