"use strict";
/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Clipboard abstraction.
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
exports.Clipboard = void 0;
var RX = require("../common/Interfaces");
var Clipboard = /** @class */ (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Clipboard.prototype.setText = function (text) {
        var node = Clipboard._createInvisibleNode();
        node.value = text;
        document.body.appendChild(node);
        Clipboard._copyNode(node);
        document.body.removeChild(node);
    };
    Clipboard.prototype.getText = function () {
        // Not supported in web platforms. This should can be only handled
        // in the paste event handlers.
        return Promise.reject('Not supported on web');
    };
    Clipboard._createInvisibleNode = function () {
        var node = document.createElement('textarea');
        node.style.position = 'absolute';
        node.style.left = '-10000px';
        node.style.width = '10px';
        // Use the same vertical position as the current page
        // to avoid scrolling on iOS Safari.
        var yPosition = window.pageYOffset || document.documentElement.scrollTop;
        node.style.top = yPosition + 'px';
        node.readOnly = true;
        return node;
    };
    Clipboard._copyNode = function (node) {
        node.select();
        node.setSelectionRange(0, node.value.length);
        document.execCommand('copy');
        var selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    };
    return Clipboard;
}(RX.Clipboard));
exports.Clipboard = Clipboard;
exports.default = new Clipboard();
