"use strict";
/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view that's used for proper layering or modals and popups.
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
exports.RootViewUsingProps = exports.RootView = exports.BaseRootView = void 0;
var React = require("react");
var RN = require("react-native");
var RNW = require("react-native-windows");
var RootView_1 = require("../native-desktop/RootView");
Object.defineProperty(exports, "BaseRootView", { enumerable: true, get: function () { return RootView_1.BaseRootView; } });
var AccessibilityAnnouncer_1 = require("./AccessibilityAnnouncer");
//
// We use a custom RNW provided component to capture key input before being dispatched to native controls.
// If support not present, we fallback to the base class implementation.
var _isRootInputViewSupported = !!RNW.RootInputViewWindows;
var _styles = RN.StyleSheet.create({
    appWrapperStyle: {
        flex: 1,
    },
});
function _renderTopView(content, onKeyDown, onKeyDownCapture, onKeyUp, onTouchStartCapture) {
    return (React.createElement(RNW.RootInputViewWindows, { onTouchStartCapture: onTouchStartCapture, onAccelKeyDown: function (e) { onKeyDownCapture(e); onKeyDown(e); }, onAccelKeyUp: onKeyUp, style: _styles.appWrapperStyle }, content));
}
var RootViewUsingStore = /** @class */ (function (_super) {
    __extends(RootViewUsingStore, _super);
    function RootViewUsingStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RootViewUsingStore.prototype.renderTopView = function (content) {
        if (_isRootInputViewSupported) {
            return _renderTopView(content, this._onKeyDown, this._onKeyDownCapture, this._onKeyUp, this._onTouchStartCapture);
        }
        else {
            return _super.prototype.renderTopView.call(this, content);
        }
    };
    RootViewUsingStore.prototype._renderAnnouncerView = function () {
        return (React.createElement(AccessibilityAnnouncer_1.AccessibilityAnnouncer, null));
    };
    return RootViewUsingStore;
}(RootView_1.RootView));
exports.RootView = RootViewUsingStore;
var RootViewUsingProps = /** @class */ (function (_super) {
    __extends(RootViewUsingProps, _super);
    function RootViewUsingProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RootViewUsingProps.prototype.renderTopView = function (content) {
        if (_isRootInputViewSupported) {
            return _renderTopView(content, this._onKeyDown, this._onKeyDownCapture, this._onKeyUp, this._onTouchStartCapture);
        }
        else {
            return _super.prototype.renderTopView.call(this, content);
        }
    };
    RootViewUsingProps.prototype._renderAnnouncerView = function () {
        return (React.createElement(AccessibilityAnnouncer_1.AccessibilityAnnouncer, null));
    };
    return RootViewUsingProps;
}(RootView_1.RootViewUsingProps));
exports.RootViewUsingProps = RootViewUsingProps;
exports.default = RootViewUsingStore;
