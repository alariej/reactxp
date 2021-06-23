"use strict";
/**
 * Alert.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native Alert dialog boxes for ReactXP.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
var RN = require("react-native");
var AppConfig_1 = require("../common/AppConfig");
var UserInterface_1 = require("../native-common/UserInterface");
// Native implementation for alert dialog boxes
var Alert = /** @class */ (function () {
    function Alert() {
    }
    Alert.prototype.show = function (title, message, buttons, options) {
        var alertOptions = {};
        if (!!options && options.preventDismissOnPress) {
            alertOptions.cancelable = false;
        }
        if (options && options.rootViewId) {
            var nodeHandle = UserInterface_1.default.findNodeHandleByRootViewId(options.rootViewId);
            if (nodeHandle) {
                alertOptions.rootViewHint = nodeHandle;
            }
            else if (AppConfig_1.default.isDevelopmentMode()) {
                console.warn('rootViewId does not exist: ', options.rootViewId);
            }
        }
        RN.Alert.alert(title, message, buttons, alertOptions);
    };
    return Alert;
}());
exports.Alert = Alert;
exports.default = new Alert();
