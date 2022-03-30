"use strict";
/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation for deep linking.
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
exports.Linking = void 0;
var RN = require("react-native");
var Interfaces_1 = require("../common/Interfaces");
var Linking_1 = require("../common/Linking");
var Linking = /** @class */ (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        var _this = _super.call(this) || this;
        RN.Linking.addEventListener('url', function (event) {
            _this.deepLinkRequestEvent.fire(event.url);
        });
        return _this;
    }
    Linking.prototype._openUrl = function (url) {
        return RN.Linking.openURL(url)
            .catch(function (error) {
            var linkingError = {
                code: Interfaces_1.Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error,
            };
            return Promise.reject(linkingError);
        });
    };
    Linking.prototype.getInitialUrl = function () {
        return RN.Linking.getInitialURL()
            .then(function (url) { return url ? url : undefined; })
            .catch(function (error) {
            var linkingError = {
                code: Interfaces_1.Types.LinkingErrorCode.InitialUrlNotFound,
                description: error,
            };
            return Promise.reject(linkingError);
        });
    };
    // Launches Email app
    Linking.prototype.launchEmail = function (emailInfo) {
        // Format email info
        var emailUrl = this._createEmailUrl(emailInfo);
        return this._openUrl(emailUrl);
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
exports.default = new Linking();
