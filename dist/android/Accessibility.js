"use strict";
/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common wrapper for accessibility helper exposed from ReactXP.
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
exports.Accessibility = void 0;
var Accessibility_1 = require("../native-common/Accessibility");
var Accessibility = /** @class */ (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // On Android, talkback fails to announce, if the new announcement is the same as the last one.
    // The reason is probably that in RootView, the announcement text is held in state and passed as a prop to RN.View.
    // If the announcement is the same, the props don't change and RN doesn't see a reason to re-render
    // the view - retrigger the announcement. This behaviour is actually expected. We work around this by checking
    // the new announcement text and comparing it with the last one. If they are the same, append a space at the end.
    Accessibility.prototype.announceForAccessibility = function (announcement) {
        if (announcement === this._lastAnnouncement) {
            announcement += ' ';
        }
        this._lastAnnouncement = announcement;
        // We cannot just call super.announceForAccessibility here, because RootView subscribes on this
        // parent class singleton instance. Calling Accessibility.announceForAccessibility from the consumer app
        // will then create a different event and the announcements won't work. Instead, we just call the
        // instance method directly.
        Accessibility_1.default.announceForAccessibility(announcement);
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
exports.default = new Accessibility();
