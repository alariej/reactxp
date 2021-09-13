"use strict";
/**
 * PopupContainerView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common parent of all components rendered into a popup, web version.
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
exports.PopupContainerView = void 0;
var React = require("react");
var PopupContainerViewBase_1 = require("../common/PopupContainerViewBase");
var lodashMini_1 = require("./utils/lodashMini");
var PopupContainerView = /** @class */ (function (_super) {
    __extends(PopupContainerView, _super);
    function PopupContainerView(props, context) {
        return _super.call(this, props, context) || this;
    }
    PopupContainerView.prototype.render = function () {
        var style = (0, lodashMini_1.clone)(this.props.style);
        if (this.props.hidden) {
            style.visibility = 'hidden';
        }
        return (React.createElement("div", { style: style, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave }, this.props.children));
    };
    return PopupContainerView;
}(PopupContainerViewBase_1.PopupContainerViewBase));
exports.PopupContainerView = PopupContainerView;
exports.default = PopupContainerView;
