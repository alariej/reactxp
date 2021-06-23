"use strict";
/**
 * UserPresence.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of the RX interfaces related to
 * user presence.
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
exports.UserPresence = void 0;
var RX = require("../common/Interfaces");
var UserPresence = /** @class */ (function (_super) {
    __extends(UserPresence, _super);
    function UserPresence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // On native platforms, assume that the user is present
    // whenever the app is running.
    UserPresence.prototype.isUserPresent = function () {
        return true;
    };
    return UserPresence;
}(RX.UserPresence));
exports.UserPresence = UserPresence;
exports.default = new UserPresence();
