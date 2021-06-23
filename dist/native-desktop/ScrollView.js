"use strict";
/**
 * ScrollView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows/OSX-specific implementation of the cross-platform ScrollView abstraction.
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
exports.ScrollView = void 0;
var RN = require("react-native");
var EventHelpers_1 = require("../native-common/utils/EventHelpers");
var ScrollView_1 = require("../native-common/ScrollView");
var isNativeWindows = RN.Platform.OS === 'windows';
var ScrollView = /** @class */ (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onKeyDown = function (e) {
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(EventHelpers_1.default.toKeyboardEvent(e));
            }
        };
        return _this;
    }
    ScrollView.prototype._render = function (nativeProps) {
        // Have to hack the windows/osx-specific onKeyDown into the props here.
        var updatedNativeProps = nativeProps;
        if (this.props.onKeyPress) {
            updatedNativeProps.onKeyDown = this._onKeyDown;
        }
        if (isNativeWindows) {
            updatedNativeProps.tabNavigation = this.props.tabNavigation;
            updatedNativeProps.disableKeyboardBasedScrolling = true;
        }
        return _super.prototype._render.call(this, updatedNativeProps);
    };
    return ScrollView;
}(ScrollView_1.ScrollView));
exports.ScrollView = ScrollView;
exports.default = ScrollView;
