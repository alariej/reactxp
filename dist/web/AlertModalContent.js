"use strict";
/**
 * AlertModalContent.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes modal content.
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
exports.AlertModalContent = void 0;
var React = require("react");
var RX = require("../common/Interfaces");
var Button_1 = require("./Button");
var Modal_1 = require("./Modal");
var Styles_1 = require("./Styles");
var Text_1 = require("./Text");
var View_1 = require("./View");
var _styles = {
    background: Styles_1.default.createViewStyle({
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        alignSelf: 'stretch',
    }),
    verticalRoot: Styles_1.default.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }),
    defaultBody: Styles_1.default.createViewStyle({
        width: 300,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        alignItems: 'stretch',
        paddingHorizontal: 8,
        paddingVertical: 4,
    }),
    defaultTitleText: Styles_1.default.createTextStyle({
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 12,
        flex: 1,
    }),
    defaultMessageText: Styles_1.default.createTextStyle({
        fontSize: 16,
        alignSelf: 'center',
        padding: 12,
        flex: 1,
    }),
    defaultButtonContainer: Styles_1.default.createButtonStyle({
        padding: 8,
        flex: 1,
    }),
    defaultButton: Styles_1.default.createButtonStyle({
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#bbb',
    }),
    defaultButtonHover: Styles_1.default.createButtonStyle({
        backgroundColor: '#eee',
    }),
    defaultCancelButton: Styles_1.default.createButtonStyle({
        borderColor: 'red',
    }),
    defaultBtnText: Styles_1.default.createTextStyle({
        fontSize: 14,
        padding: 8,
        color: '#333',
    }),
    defaultCancelBtnText: Styles_1.default.createTextStyle({
        color: 'red',
    }),
};
var AlertModalContent = /** @class */ (function (_super) {
    __extends(AlertModalContent, _super);
    function AlertModalContent(props) {
        var _this = _super.call(this, props) || this;
        _this._onPressBody = function (e) {
            e.stopPropagation();
        };
        _this._onPressBackground = function (e) {
            if (!_this.props.preventDismissOnPress) {
                Modal_1.default.dismiss(_this.props.modalId);
            }
        };
        _this.state = {
            hoverIndex: -1,
        };
        return _this;
    }
    AlertModalContent.prototype.render = function () {
        var _this = this;
        var theme = this.props.theme;
        var buttons = this.props.buttons && this.props.buttons.map(function (btnSpec, i) {
            var isCancel = btnSpec.style === 'cancel';
            var buttonStyle = [_styles.defaultButton, isCancel ? _styles.defaultCancelButton : undefined];
            var buttonTextStyle = [_styles.defaultBtnText, isCancel ? _styles.defaultCancelBtnText : undefined];
            // Is the mouse pointer currently hovering over this button?
            if (_this.state.hoverIndex === i) {
                buttonStyle.push(_styles.defaultButtonHover);
            }
            if (theme) {
                buttonStyle.push(theme.buttonStyle);
                buttonTextStyle.push(theme.buttonTextStyle);
                if (isCancel) {
                    buttonStyle.push(theme.cancelButtonStyle);
                    buttonTextStyle.push(theme.cancelButtonTextStyle);
                }
                if (_this.state.hoverIndex === i) {
                    buttonStyle.push(isCancel ? theme.cancelButtonHoverStyle : theme.buttonHoverStyle);
                }
            }
            return (React.createElement(View_1.default, { key: 'button_' + i, style: _styles.defaultButtonContainer },
                React.createElement(Button_1.default, { onPress: function (e) { return _this._onPressButton(btnSpec); }, onHoverStart: function () { return _this.setState({ hoverIndex: i }); }, onHoverEnd: function () { return _this.setState({ hoverIndex: -1 }); }, style: buttonStyle },
                    React.createElement(Text_1.default, { style: buttonTextStyle }, btnSpec.text))));
        });
        return (React.createElement(View_1.default, { style: _styles.background, onPress: this._onPressBackground },
            React.createElement(View_1.default, { style: _styles.verticalRoot },
                React.createElement(View_1.default, { style: [_styles.defaultBody, theme && theme.bodyStyle], onPress: this._onPressBody },
                    React.createElement(View_1.default, null,
                        React.createElement(Text_1.default, { style: [_styles.defaultTitleText, theme && theme.titleTextStyle] }, this.props.title)),
                    React.createElement(View_1.default, null,
                        React.createElement(Text_1.default, { style: [_styles.defaultMessageText, theme && theme.messageTextStyle] }, this.props.message)),
                    buttons))));
    };
    AlertModalContent.prototype._onPressButton = function (btnSpec) {
        Modal_1.default.dismiss(this.props.modalId);
        if (btnSpec.onPress) {
            btnSpec.onPress();
        }
    };
    return AlertModalContent;
}(RX.Component));
exports.AlertModalContent = AlertModalContent;
exports.default = AlertModalContent;
