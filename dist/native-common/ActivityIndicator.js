"use strict";
/**
 * ActivityIndicator.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Control to display an animated activity indicator.
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
exports.ActivityIndicator = void 0;
var React = require("react");
var RN = require("react-native");
var Timers_1 = require("../common/utils/Timers");
var ActivityIndicator = /** @class */ (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator(props) {
        var _this = _super.call(this, props) || this;
        _this._isMounted = false;
        _this.state = { isVisible: false };
        return _this;
    }
    ActivityIndicator.prototype.componentDidMount = function () {
        var _this = this;
        this._isMounted = true;
        if (this.props.deferTime && this.props.deferTime > 0) {
            Timers_1.default.setTimeout(function () {
                if (_this._isMounted) {
                    _this.setState({ isVisible: true });
                }
            }, this.props.deferTime);
        }
        else {
            this.setState({ isVisible: true });
        }
    };
    ActivityIndicator.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    ActivityIndicator.prototype.render = function () {
        var size;
        switch (this.props.size) {
            case 'tiny':
            case 'small':
            case 'medium':
                size = 'small';
                break; // React Native ActivityIndicator does not support 'tiny' or medium' size
            case 'large':
            default:
                size = 'large';
                break;
        }
        return (React.createElement(RN.ActivityIndicator, { animating: true, color: this.state.isVisible ? this.props.color : 'transparent', size: size, testID: this.props.testId }));
    };
    return ActivityIndicator;
}(React.Component));
exports.ActivityIndicator = ActivityIndicator;
exports.default = ActivityIndicator;
