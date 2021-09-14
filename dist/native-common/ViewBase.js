"use strict";
/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Base class that is used for several RX views.
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
exports.ViewBase = void 0;
var RN = require("react-native");
var RX = require("../common/Interfaces");
var lodashMini_1 = require("./utils/lodashMini");
var ViewBase = /** @class */ (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._setNativeComponent = function (view) {
            _this._nativeComponent = view || undefined;
        };
        _this._onLayout = function (event) {
            if (_this.props.onLayout) {
                var layoutEventValues = {
                    x: event.nativeEvent.layout.x,
                    y: event.nativeEvent.layout.y,
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height,
                };
                // Only fire the onLayout callback if the layout values change
                if (!(0, lodashMini_1.isEqual)(_this._layoutEventValues, layoutEventValues)) {
                    _this.props.onLayout(layoutEventValues);
                    _this._layoutEventValues = layoutEventValues;
                }
            }
        };
        return _this;
    }
    ViewBase.setDefaultViewStyle = function (defaultViewStyle) {
        ViewBase._defaultViewStyle = defaultViewStyle;
    };
    ViewBase.getDefaultViewStyle = function () {
        return ViewBase._defaultViewStyle;
    };
    // To be able to use View inside TouchableHighlight/TouchableOpacity
    ViewBase.prototype.setNativeProps = function (nativeProps) {
        // We know that View and ScrollView both has setNative props even if the typings don't exist
        var nativeComponent = this._nativeComponent;
        if (nativeComponent && nativeComponent.setNativeProps) {
            nativeComponent.setNativeProps(nativeProps);
        }
    };
    ViewBase.prototype._getStyles = function (props) {
        // If this platform uses an explicit default view style, push it on to
        // the front of the list of provided styles.
        if (ViewBase._defaultViewStyle) {
            return [ViewBase._defaultViewStyle, props.style];
        }
        return props.style;
    };
    ViewBase._supportsNativeFocusBlur = RN.Platform.OS !== 'android';
    return ViewBase;
}(RX.ViewBase));
exports.ViewBase = ViewBase;
exports.default = ViewBase;
