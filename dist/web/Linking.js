"use strict";
/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation for deep linking
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
var Interfaces_1 = require("../common/Interfaces");
var Linking_1 = require("../common/Linking");
var Linking = /** @class */ (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Linking.prototype._openUrl = function (url) {
        var otherWindow = window.open();
        if (!otherWindow) {
            // window opening was blocked by browser (probably not
            // invoked in direct reaction to user action, like thru
            // promise or setTimeout).
            var linkingError = {
                code: Interfaces_1.Types.LinkingErrorCode.Blocked,
                url: url,
                description: 'Window was blocked by popup blocker',
            };
            return Promise.reject(linkingError);
        }
        // SECURITY WARNING:
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        // Note: can only set to null, otherwise is readonly.
        // Note: In order for mailto links to work properly window.opener cannot be null.
        if (url.indexOf('mailto:') !== 0) {
            otherWindow.opener = null;
        }
        otherWindow.location.href = url;
        return Promise.resolve(void 0);
    };
    Linking.prototype.launchEmail = function (emailInfo) {
        // Format email info
        var emailUrl = this._createEmailUrl(emailInfo);
        window.location.href = emailUrl;
        return Promise.resolve(void 0);
    };
    Linking.prototype.getInitialUrl = function () {
        return Promise.resolve(undefined);
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
exports.default = new Linking();
