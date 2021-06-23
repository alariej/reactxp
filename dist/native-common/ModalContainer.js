"use strict";
/**
 * ModalContainer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Modal abstraction.
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
exports.ModalContainer = void 0;
var React = require("react");
var RN = require("react-native");
var _styles = {
    defaultContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // On Android, we need to provide some color to prevent
        // removal of the view.
        backgroundColor: 'transparent',
    },
    hiddenContainer: {
        width: 0,
        height: 0,
    },
};
var ModalContainer = /** @class */ (function (_super) {
    __extends(ModalContainer, _super);
    function ModalContainer(props) {
        return _super.call(this, props) || this;
    }
    ModalContainer.prototype.render = function () {
        var style = this.props.hidden ? _styles.hiddenContainer : _styles.defaultContainer;
        return (React.createElement(RN.View, { style: style }, this.props.children));
    };
    return ModalContainer;
}(React.Component));
exports.ModalContainer = ModalContainer;
exports.default = ModalContainer;
