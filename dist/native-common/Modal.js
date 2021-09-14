"use strict";
/**
 * Modal.tsx
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
exports.Modal = void 0;
var assert_1 = require("../common/assert");
var RX = require("../common/Interfaces");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Modal.prototype.isDisplayed = function (modalId) {
        return FrontLayerViewManager_1.default.isModalDisplayed(modalId);
    };
    Modal.prototype.show = function (modal, modalId, options) {
        (0, assert_1.default)(modal, "modal must be valid. Actual: " + modal);
        (0, assert_1.default)(modalId, "modalId must be a non-empty string. Actual: " + modalId);
        FrontLayerViewManager_1.default.showModal(modal, modalId, options);
    };
    Modal.prototype.dismiss = function (modalId) {
        (0, assert_1.default)(modalId, "modalId must be a non-empty string. Actual: " + modalId);
        FrontLayerViewManager_1.default.dismissModal(modalId);
    };
    Modal.prototype.dismissAll = function () {
        FrontLayerViewManager_1.default.dismissAllmodals();
    };
    return Modal;
}(RX.Modal));
exports.Modal = Modal;
exports.default = new Modal();
