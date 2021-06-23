"use strict";
/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Text abstraction.
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
exports.Text = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Interfaces_1 = require("../common/Interfaces");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Styles_1 = require("./Styles");
// Adding a CSS rule to display non-selectable texts. Those texts
// will be displayed as pseudo elements to prevent them from being copied
// to clipboard. It's not possible to style pseudo elements with inline
// styles, so, we're dynamically creating a <style> tag with the rule.
if (typeof document !== 'undefined') {
    var textAsPseudoElement = '[data-text-as-pseudo-element]::before { content: attr(data-text-as-pseudo-element); }';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(textAsPseudoElement));
    document.head.appendChild(style);
}
// Cast to any to allow merging of web and RX styles
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis',
    },
};
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mountedText = null;
        _this._onMount = function (ref) {
            _this._mountedText = ref;
        };
        return _this;
    }
    Text.prototype.getChildContext = function () {
        // Let descendant Types components know that their nearest Types ancestor is an Types.Text.
        // Because they're in an Types.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    };
    Text.prototype.render = function () {
        // Handle special case
        if (typeof this.props.children === 'string' && this.props.children === '\n') {
            return React.createElement("br", null);
        }
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        if (this.props.selectable || typeof this.props.children !== 'string') {
            return (React.createElement("div", { ref: this._onMount, style: this._getStyles(), "aria-hidden": isAriaHidden, onClick: this.props.onPress, id: this.props.id, onContextMenu: this.props.onContextMenu, "data-test-id": this.props.testId }, this.props.children));
        }
        else {
            // user-select CSS property doesn't prevent the text from being copied to clipboard.
            // To avoid getting to clipboard, the text from data-text-as-pseudo-element attribute
            // will be displayed as pseudo element.
            return (React.createElement("div", { ref: this._onMount, style: this._getStyles(), "aria-hidden": isAriaHidden, onClick: this.props.onPress, onContextMenu: this.props.onContextMenu, "data-text-as-pseudo-element": this.props.children, id: this.props.id, "data-test-id": this.props.testId }));
        }
    };
    Text.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    Text.prototype._getStyles = function () {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        var combinedStyles = Styles_1.default.combine([this.props.numberOfLines === 1 ?
                _styles.ellipsis : _styles.defaultStyle, this.props.style]);
        if (this.props.selectable) {
            combinedStyles.userSelect = 'text';
            combinedStyles.WebkitUserSelect = 'text';
            combinedStyles.MozUserSelect = 'text';
            combinedStyles.msUserSelect = 'text';
        }
        // Handle cursor styles
        if (!combinedStyles.cursor) {
            if (this.props.selectable) {
                combinedStyles.cursor = 'text';
            }
            else {
                combinedStyles.cursor = 'inherit';
            }
            if (this.props.onPress) {
                combinedStyles.cursor = 'pointer';
            }
        }
        return combinedStyles;
    };
    Text.prototype.blur = function () {
        if (this._mountedText) {
            this._mountedText.blur();
        }
    };
    Text.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._mountedText !== null; });
    };
    Text.prototype.focus = function () {
        if (this._mountedText) {
            this._mountedText.focus();
        }
    };
    Text.prototype.getSelectedText = function () {
        return ''; // Not implemented yet.
    };
    Text.contextTypes = {
        focusArbitrator: PropTypes.object,
    };
    Text.childContextTypes = {
        isRxParentAText: PropTypes.bool.isRequired,
    };
    return Text;
}(Interfaces_1.Text));
exports.Text = Text;
exports.default = Text;
