"use strict";
/**
 * PopupContainerViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common parent of all components rendered into a popup. Calls onShow and onHide
 * callbacks when the popup is hidden (i.e. "closed" but still rendered as hidden)
 * and re-shown. Abstract class to be overriden per platform.
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
exports.PopupContainerViewBase = exports.recalcPositionFromLayoutData = void 0;
var PropTypes = require("prop-types");
var React = require("react");
// Width of the "alley" around popups so they don't get too close to the boundary of the screen boundary.
var ALLEY_WIDTH = 2;
// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
var MIN_ANCHOR_OFFSET = 16;
// Undefined response means to dismiss the popup
function recalcPositionFromLayoutData(windowDims, anchorRect, popupRect, positionPriorities, useInnerPositioning) {
    // If the anchor has disappeared, dismiss the popup.
    if (!(anchorRect.width > 0 && anchorRect.height > 0)) {
        return undefined;
    }
    // If the anchor is no longer in the window's bounds, cancel the popup.
    if (anchorRect.left >= windowDims.width || anchorRect.right <= 0 ||
        anchorRect.bottom <= 0 || anchorRect.top >= windowDims.height) {
        return undefined;
    }
    var positionsToTry = positionPriorities;
    if (!positionsToTry || positionsToTry.length === 0) {
        positionsToTry = ['bottom', 'right', 'top', 'left'];
    }
    if (positionsToTry.length === 1 && positionsToTry[0] === 'context') {
        // Context only works with exact matches, so fall back to walking around the compass if it doesn't fit exactly.
        positionsToTry.push('bottom', 'right', 'top', 'left');
    }
    if (useInnerPositioning) {
        // If the popup is meant to be shown inside the anchor we need to recalculate
        // the position differently.
        return recalcInnerPosition(anchorRect, positionsToTry[0], popupRect.width, popupRect.height);
    }
    // Start by assuming that we'll be unconstrained.
    var result = {
        popupX: 0,
        popupY: 0,
        anchorOffset: 0,
        anchorPosition: 'top',
        constrainedPopupWidth: popupRect.width,
        constrainedPopupHeight: popupRect.height,
    };
    var foundPerfectFit = false;
    var foundPartialFit = false;
    positionsToTry.forEach(function (pos) {
        if (!foundPerfectFit) {
            var absX = 0;
            var absY = 0;
            var anchorOffset = 0;
            var constrainedWidth = 0;
            var constrainedHeight = 0;
            switch (pos) {
                case 'bottom':
                    absY = anchorRect.bottom;
                    absX = anchorRect.left + (anchorRect.width - popupRect.width) / 2;
                    anchorOffset = popupRect.width / 2;
                    if (popupRect.height <= windowDims.height - ALLEY_WIDTH - anchorRect.bottom) {
                        foundPerfectFit = true;
                    }
                    else if (!foundPartialFit) {
                        constrainedHeight = windowDims.height - ALLEY_WIDTH - anchorRect.bottom;
                    }
                    break;
                case 'top':
                    absY = anchorRect.top - popupRect.height;
                    absX = anchorRect.left + (anchorRect.width - popupRect.width) / 2;
                    anchorOffset = popupRect.width / 2;
                    if (popupRect.height <= anchorRect.top - ALLEY_WIDTH) {
                        foundPerfectFit = true;
                    }
                    else if (!foundPartialFit) {
                        constrainedHeight = anchorRect.top - ALLEY_WIDTH;
                    }
                    break;
                case 'right':
                    absX = anchorRect.right;
                    absY = anchorRect.top + (anchorRect.height - popupRect.height) / 2;
                    anchorOffset = popupRect.height / 2;
                    if (popupRect.width <= windowDims.width - ALLEY_WIDTH - anchorRect.right) {
                        foundPerfectFit = true;
                    }
                    else if (!foundPartialFit) {
                        constrainedWidth = windowDims.width - ALLEY_WIDTH - anchorRect.right;
                    }
                    break;
                case 'left':
                    absX = anchorRect.left - popupRect.width;
                    absY = anchorRect.top + (anchorRect.height - popupRect.height) / 2;
                    anchorOffset = popupRect.height / 2;
                    if (popupRect.width <= anchorRect.left - ALLEY_WIDTH) {
                        foundPerfectFit = true;
                    }
                    else if (!foundPartialFit) {
                        constrainedWidth = anchorRect.left - ALLEY_WIDTH;
                    }
                    break;
                case 'context': {
                    // Search for perfect fits on the LR, LL, TR, and TL corners.
                    var fitsAbove = anchorRect.top - popupRect.height >= ALLEY_WIDTH;
                    var fitsBelow = anchorRect.top + anchorRect.height + popupRect.height <= windowDims.height - ALLEY_WIDTH;
                    var fitsLeft = anchorRect.left - popupRect.width >= ALLEY_WIDTH;
                    var fitsRight = anchorRect.left + anchorRect.width + popupRect.width <= windowDims.width - ALLEY_WIDTH;
                    if (fitsBelow && fitsRight) {
                        foundPerfectFit = true;
                        absX = anchorRect.left + anchorRect.width;
                        absY = anchorRect.top + anchorRect.height;
                    }
                    else if (fitsBelow && fitsLeft) {
                        foundPerfectFit = true;
                        absX = anchorRect.left - popupRect.width;
                        absY = anchorRect.top + anchorRect.height;
                    }
                    else if (fitsAbove && fitsRight) {
                        foundPerfectFit = true;
                        absX = anchorRect.left + anchorRect.width;
                        absY = anchorRect.top - popupRect.height;
                    }
                    else if (fitsAbove && fitsLeft) {
                        foundPerfectFit = true;
                        absX = anchorRect.left - popupRect.width;
                        absY = anchorRect.top - popupRect.height;
                    }
                    break;
                }
            }
            var effectiveWidth = constrainedWidth || popupRect.width;
            var effectiveHeight = constrainedHeight || popupRect.height;
            // Make sure we're not hanging off the bounds of the window.
            if (absX < ALLEY_WIDTH) {
                if (pos === 'top' || pos === 'bottom') {
                    anchorOffset -= ALLEY_WIDTH - absX;
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absX = ALLEY_WIDTH;
            }
            else if (absX > windowDims.width - ALLEY_WIDTH - effectiveWidth) {
                if (pos === 'top' || pos === 'bottom') {
                    anchorOffset -= (windowDims.width - ALLEY_WIDTH - effectiveWidth - absX);
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveWidth - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absX = windowDims.width - ALLEY_WIDTH - effectiveWidth;
            }
            if (absY < ALLEY_WIDTH) {
                if (pos === 'right' || pos === 'left') {
                    anchorOffset += absY - ALLEY_WIDTH;
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absY = ALLEY_WIDTH;
            }
            else if (absY > windowDims.height - ALLEY_WIDTH - effectiveHeight) {
                if (pos === 'right' || pos === 'left') {
                    anchorOffset -= (windowDims.height - ALLEY_WIDTH - effectiveHeight - absY);
                    if (anchorOffset < MIN_ANCHOR_OFFSET || anchorOffset > effectiveHeight - MIN_ANCHOR_OFFSET) {
                        foundPerfectFit = false;
                    }
                }
                absY = windowDims.height - ALLEY_WIDTH - effectiveHeight;
            }
            if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                result.popupY = absY;
                result.popupX = absX;
                result.anchorOffset = anchorOffset;
                result.anchorPosition = pos;
                result.constrainedPopupWidth = effectiveWidth;
                result.constrainedPopupHeight = effectiveHeight;
                foundPartialFit = true;
            }
        }
    });
    return result;
}
exports.recalcPositionFromLayoutData = recalcPositionFromLayoutData;
function recalcInnerPosition(anchorRect, positionToUse, popupWidth, popupHeight) {
    // For inner popups we only accept the first position of the priorities since there
    // should always be room for the bubble.
    var popupX = 0;
    var popupY = 0;
    var anchorOffset = 0;
    switch (positionToUse) {
        case 'top':
            popupY = anchorRect.top + anchorRect.height - popupHeight;
            popupX = anchorRect.left + anchorRect.height / 2 - popupWidth / 2;
            anchorOffset = popupWidth / 2;
            break;
        case 'bottom':
            popupY = anchorRect.top + popupHeight;
            popupX = anchorRect.left + anchorRect.height / 2 - popupWidth / 2;
            anchorOffset = popupWidth / 2;
            break;
        case 'left':
            popupY = anchorRect.top + anchorRect.height / 2 - popupHeight / 2;
            popupX = anchorRect.left + anchorRect.width - popupWidth;
            anchorOffset = popupHeight / 2;
            break;
        case 'right':
            popupY = anchorRect.top + anchorRect.height / 2 - popupHeight / 2;
            popupX = anchorRect.left;
            anchorOffset = popupHeight / 2;
            break;
        case 'context':
            throw new Error('Context popup mode not allowed with inner positioning');
    }
    var result = {
        popupX: popupX,
        popupY: popupY,
        anchorOffset: anchorOffset,
        anchorPosition: positionToUse,
        constrainedPopupWidth: popupWidth,
        constrainedPopupHeight: popupHeight,
    };
    return result;
}
var PopupContainerViewBase = /** @class */ (function (_super) {
    __extends(PopupContainerViewBase, _super);
    function PopupContainerViewBase(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._popupComponentStack = [];
        return _this;
    }
    PopupContainerViewBase.prototype.getChildContext = function () {
        return {
            focusManager: this.context.focusManager,
            popupContainer: this,
        };
    };
    PopupContainerViewBase.prototype.registerPopupComponent = function (onShow, onHide) {
        var component = {
            onShow: onShow,
            onHide: onHide,
        };
        this._popupComponentStack.push(component);
        return component;
    };
    PopupContainerViewBase.prototype.unregisterPopupComponent = function (component) {
        this._popupComponentStack = this._popupComponentStack.filter(function (c) { return c !== component; });
    };
    PopupContainerViewBase.prototype.isHidden = function () {
        return !!this.props.hidden;
    };
    PopupContainerViewBase.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevProps.hidden && !this.props.hidden) {
            // call onShow on all registered components (iterate front to back)
            for (var i = 0; i < this._popupComponentStack.length; i++) {
                this._popupComponentStack[i].onShow();
            }
        }
        if (!prevProps.hidden && this.props.hidden) {
            // call onHide on all registered components (iterate back to front)
            for (var i = this._popupComponentStack.length - 1; i >= 0; i--) {
                this._popupComponentStack[i].onHide();
            }
        }
    };
    PopupContainerViewBase.contextTypes = {
        focusManager: PropTypes.object,
    };
    PopupContainerViewBase.childContextTypes = {
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
    };
    return PopupContainerViewBase;
}(React.Component));
exports.PopupContainerViewBase = PopupContainerViewBase;
exports.default = PopupContainerViewBase;
