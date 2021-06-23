"use strict";
/**
 * Link.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Link abstraction.
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
exports.Link = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var Timers_1 = require("../common/utils/Timers");
var FocusManager_1 = require("./utils/FocusManager");
var Styles_1 = require("./Styles");
var _styles = {
    defaultStyle: {
        overflowWrap: 'break-word',
        msHyphens: 'auto',
        overflow: 'hidden',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        display: 'inline',
        cursor: 'pointer',
    },
    ellipsis: {
        textOverflow: 'ellipsis',
        whiteSpace: 'pre',
        msHyphens: 'none',
    },
    selectable: {
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text',
        userSelect: 'text',
    },
};
var _longPressTime = 1000;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mountedAnchor = null;
        _this._onMount = function (ref) {
            _this._mountedAnchor = ref;
        };
        _this._onClick = function (e) {
            e.stopPropagation();
            if (_this.props.onPress) {
                e.preventDefault();
                _this.props.onPress(e, _this.props.url);
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.props.onLongPress) {
                e.persist();
                _this._longPressTimer = Timers_1.default.setTimeout(function () {
                    _this._longPressTimer = undefined;
                    var mouseEvent = e;
                    // Ignore right mouse button for long press. Context menu will
                    // be always displayed on mouseUp no matter the press length.
                    if (_this.props.onLongPress && mouseEvent.button !== 2) {
                        _this.props.onLongPress(e, _this.props.url);
                    }
                }, _longPressTime);
            }
        };
        _this._onMouseUp = function (e) {
            if (_this._longPressTimer) {
                Timers_1.default.clearTimeout(_this._longPressTimer);
                _this._longPressTimer = undefined;
            }
        };
        _this._onContextMenu = function (e) {
            if (_this.props.onContextMenu) {
                e.stopPropagation();
                e.preventDefault();
                _this.props.onContextMenu(e);
            }
        };
        return _this;
    }
    Link.prototype.render = function () {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (React.createElement("a", { ref: this._onMount, style: this._getStyles(), title: this.props.title, href: this.props.url, target: '_blank', rel: 'noreferrer', onClick: this._onClick, onMouseEnter: this.props.onHoverStart, onMouseLeave: this.props.onHoverEnd, onMouseDown: this._onMouseDown, onMouseUp: this._onMouseUp, tabIndex: this.props.tabIndex, onContextMenu: this.props.onContextMenu ? this._onContextMenu : undefined, "data-test-id": this.props.testId }, this.props.children));
    };
    Link.prototype.componentDidMount = function () {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    };
    Link.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._mountedAnchor !== null; });
    };
    Link.prototype.focus = function () {
        if (this._mountedAnchor) {
            this._mountedAnchor.focus();
        }
    };
    Link.prototype.blur = function () {
        if (this._mountedAnchor) {
            this._mountedAnchor.blur();
        }
    };
    Link.prototype._getStyles = function () {
        // There's no way in HTML to properly handle numberOfLines > 1,
        //  but we can correctly handle the common case where numberOfLines is 1.
        var ellipsisStyles = this.props.numberOfLines === 1 ? _styles.ellipsis : {};
        var selectableStyles = this.props.selectable ? _styles.selectable : {};
        return Styles_1.default.combine([_styles.defaultStyle, ellipsisStyles, this.props.style, selectableStyles]);
    };
    Link.contextTypes = {
        focusArbitrator: PropTypes.object,
    };
    return Link;
}(React.Component));
exports.Link = Link;
FocusManager_1.applyFocusableComponentMixin(Link);
exports.default = Link;
