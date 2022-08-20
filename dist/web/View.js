"use strict";
/**
 * View.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform View abstraction.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var PropTypes = require("prop-types");
var React = require("react");
var ReactDOM = require("react-dom");
var AppConfig_1 = require("../common/AppConfig");
var AutoFocusHelper_1 = require("../common/utils/AutoFocusHelper");
var FocusManager_1 = require("../common/utils/FocusManager");
var RX = require("../common/Interfaces");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var FocusManager_2 = require("./utils/FocusManager");
var restyleForInlineText_1 = require("./utils/restyleForInlineText");
var Styles_1 = require("./Styles");
var ViewBase_1 = require("./ViewBase");
var AnimateListEdits_1 = require("./listAnimations/AnimateListEdits");
// Cast to any to allow merging of web and RX styles
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
    },
    // See resize detector comments in renderResizeDetectorIfNeeded() method below.
    resizeDetectorContainerStyles: {
        position: 'absolute',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        overflow: 'scroll',
        zIndex: '-1',
        visibility: 'hidden',
    },
    resizeGrowDetectorStyles: {
        position: 'absolute',
        left: '100500px',
        top: '100500px',
        width: '1px',
        height: '1px',
    },
    resizeShrinkDetectorStyles: {
        position: 'absolute',
        width: '150%',
        height: '150%',
    },
};
if (typeof document !== 'undefined') {
    var ignorePointerEvents = '.reactxp-ignore-pointer-events  * { pointer-events: auto; }';
    var blockPointerEvents = '.reactxp-block-pointer-events * { pointer-events: none !important; }';
    var head = document.head;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(ignorePointerEvents));
    style.appendChild(document.createTextNode(blockPointerEvents));
    head.appendChild(style);
}
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._limitFocusWithin = false;
        _this._isFocusLimited = false;
        _this._resizeDetectorNodes = {};
        _this._onResizeDetectorGrowRef = function (node) {
            _this._resizeDetectorNodes.grow = node || undefined;
            _this._resizeDetectorOnScroll();
        };
        _this._onResizeDetectorShrinkRef = function (node) {
            _this._resizeDetectorNodes.shrink = node || undefined;
            _this._resizeDetectorOnScroll();
        };
        _this._resizeDetectorOnScroll = function () {
            if (_this._resizeDetectorAnimationFrame) {
                // Do not execute action more often than once per animation frame.
                return;
            }
            _this._resizeDetectorAnimationFrame = window.requestAnimationFrame(function () {
                if (_this._isMounted) {
                    _this._resizeDetectorReset();
                    _this._resizeDetectorAnimationFrame = undefined;
                    ViewBase_1.default._checkViews();
                }
            });
        };
        _this._limitFocusWithin =
            (props.limitFocusWithin === RX.Types.LimitFocusType.Limited) ||
                (props.limitFocusWithin === RX.Types.LimitFocusType.Accessible);
        if (_this.props.restrictFocusWithin || _this._limitFocusWithin) {
            _this._focusManager = new FocusManager_2.FocusManager(context && context.focusManager);
            if (_this._limitFocusWithin) {
                _this.setFocusLimited(true);
            }
        }
        _this._popupContainer = context && context.popupContainer;
        if (props.arbitrateFocus) {
            _this._updateFocusArbitratorProvider(props);
        }
        return _this;
    }
    View.prototype._renderResizeDetectorIfNeeded = function (containerStyles) {
        // If needed, additional invisible DOM elements will be added inside the
        // view to track the size changes that are performed behind our back by
        // the browser's layout engine faster (ViewBase checks for the layout
        // updates once a second and sometimes it's not fast enough).
        // Unfortunately <div> doesn't have `resize` event, so we're trying to
        // detect the fact that the view has been resized with `scroll` events.
        // To do that, we create two scrollable <div>s and we put them into a
        // state in which `scroll` event is triggered by the browser when the
        // container gets resized (one element triggers `scroll` when the
        // container gets bigger, another triggers `scroll` when the container
        // gets smaller).
        if (!this.props.importantForLayout) {
            return null;
        }
        if (containerStyles.position !== 'relative') {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('View: importantForLayout property is applicable only for a view with relative position');
            }
            return null;
        }
        return [
            (React.createElement("div", { key: 'grow', style: _styles.resizeDetectorContainerStyles, ref: this._onResizeDetectorGrowRef, onScroll: this._resizeDetectorOnScroll },
                React.createElement("div", { style: _styles.resizeGrowDetectorStyles }))),
            (React.createElement("div", { key: 'shrink', style: _styles.resizeDetectorContainerStyles, ref: this._onResizeDetectorShrinkRef, onScroll: this._resizeDetectorOnScroll },
                React.createElement("div", { style: _styles.resizeShrinkDetectorStyles }))),
        ];
    };
    View.prototype._resizeDetectorReset = function () {
        // Scroll the detectors to the bottom-right corner so
        // that `scroll` events will be triggered when the container
        // is resized.
        var scrollMax = 100500;
        var node = this._resizeDetectorNodes.grow;
        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
        node = this._resizeDetectorNodes.shrink;
        if (node) {
            node.scrollLeft = scrollMax;
            node.scrollTop = scrollMax;
        }
    };
    View.prototype.getChildContext = function () {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        var childContext = {
            isRxParentAText: false,
        };
        // Provide the descendants with the focus manager and popup container (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
        }
        if (this._popupContainer) {
            childContext.popupContainer = this._popupContainer;
        }
        if (this._focusArbitratorProvider) {
            childContext.focusArbitrator = this._focusArbitratorProvider;
        }
        return childContext;
    };
    View.prototype._getContainer = function () {
        if (!this._isMounted) {
            return null;
        }
        try {
            return ReactDOM.findDOMNode(this);
        }
        catch (_a) {
            // Handle exception due to potential unmount race condition.
            return null;
        }
    };
    View.prototype._isHidden = function () {
        return !!this._popupContainer && this._popupContainer.isHidden();
    };
    View.prototype._updateFocusArbitratorProvider = function (props) {
        if (props.arbitrateFocus) {
            if (this._focusArbitratorProvider) {
                this._focusArbitratorProvider.setCallback(props.arbitrateFocus);
            }
            else {
                this._focusArbitratorProvider = new AutoFocusHelper_1.FocusArbitratorProvider(this, props.arbitrateFocus);
            }
        }
        else if (this._focusArbitratorProvider) {
            delete this._focusArbitratorProvider;
        }
    };
    View.prototype.setFocusRestricted = function (restricted) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set');
            }
            return;
        }
        if (!this._isHidden()) {
            if (restricted) {
                this._focusManager.restrictFocusWithin(FocusManager_1.RestrictFocusType.RestrictedFocusFirst);
            }
            else {
                this._focusManager.removeFocusRestriction();
            }
        }
        this._isFocusRestricted = restricted;
    };
    View.prototype.setFocusLimited = function (limited) {
        if (!this._focusManager || !this._limitFocusWithin) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('View: setFocusLimited method requires limitFocusWithin property to be set');
            }
            return;
        }
        if (!this._isHidden()) {
            if (limited && !this._isFocusLimited) {
                this._focusManager.limitFocusWithin(this.props.limitFocusWithin);
            }
            else if (!limited && this._isFocusLimited) {
                this._focusManager.removeFocusLimitation();
            }
        }
        this._isFocusLimited = limited;
    };
    View.prototype.render = function () {
        var combinedStyles = Styles_1.default.combine([_styles.defaultStyle, this.props.style]);
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        var tabIndex = this.props.tabIndex;
        var ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        var accessibilityLabel = this.props.accessibilityLabel;
        var ariaLabelledBy = this.props.ariaLabelledBy;
        var ariaRoleDescription = this.props.ariaRoleDescription;
        var ariaLive = this.props.accessibilityLiveRegion ?
            AccessibilityUtil_1.default.accessibilityLiveRegionToString(this.props.accessibilityLiveRegion) :
            undefined;
        var ariaValueNow = this.props.ariaValueNow;
        if (!ariaRole && !accessibilityLabel && !ariaLabelledBy && !ariaRoleDescription && !ariaLive &&
            (ariaSelected === undefined) && (ariaValueNow === undefined) && (tabIndex === undefined)) {
            // When the accessibility properties are not specified, set role to none.
            // It tells the screen readers to skip the node, but unlike setting
            // aria-hidden to true, allows the sub DOM to be processed further.
            // This signigicantly improves the screen readers performance.
            ariaRole = 'none';
        }
        var props = {
            role: ariaRole,
            tabIndex: tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            'aria-labelledby': ariaLabelledBy,
            'aria-roledescription': ariaRoleDescription,
            'aria-live': ariaLive,
            'aria-valuenow': ariaValueNow,
            onContextMenu: this.props.onContextMenu,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onMouseOver: this.props.onMouseOver,
            onMouseMove: this.props.onMouseMove,
            // Weird things happen: ReactXP.Types.Touch is not assignable to React.Touch
            onTouchStart: this.props.onResponderStart,
            onTouchStartCapture: this.props.onTouchStartCapture,
            onTouchMove: this.props.onResponderMove,
            onTouchMoveCapture: this.props.onTouchMoveCapture,
            onTouchEnd: this.props.onResponderRelease,
            onTouchCancel: this.props.onResponderTerminate,
            draggable: this.props.onDragStart ? true : undefined,
            onDragStart: this.props.onDragStart,
            onDrag: this.props.onDrag,
            onDragEnd: this.props.onDragEnd,
            onDragEnter: this.props.onDragEnter,
            onDragOver: this.props.onDragOver,
            onDragLeave: this.props.onDragLeave,
            onDrop: this.props.onDrop,
            onClick: this.props.onPress,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyDown: this.props.onKeyPress,
            id: this.props.id,
        };
        if (this.props.blockPointerEvents) {
            // Make this element and all children transparent to pointer events
            props.className = 'reactxp-block-pointer-events';
            combinedStyles.pointerEvents = 'none';
        }
        else if (this.props.ignorePointerEvents) {
            // Make this element transparent to pointer events, but allow children to still receive events
            props.className = 'reactxp-ignore-pointer-events';
            combinedStyles.pointerEvents = 'none';
        }
        var reactElement;
        var childAnimationsEnabled = this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave;
        if (childAnimationsEnabled) {
            reactElement = (React.createElement(AnimateListEdits_1.default, __assign({}, props, { "data-test-id": this.props.testId, animateChildEnter: this.props.animateChildEnter, animateChildMove: this.props.animateChildMove, animateChildLeave: this.props.animateChildLeave }), this.props.children));
        }
        else {
            reactElement = (React.createElement("div", __assign({}, props, { "data-test-id": this.props.testId }),
                this._renderResizeDetectorIfNeeded(combinedStyles),
                this.props.children));
        }
        return this.context.isRxParentAText ?
            (0, restyleForInlineText_1.default)(reactElement) :
            reactElement;
    };
    View.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        _super.prototype.UNSAFE_componentWillReceiveProps.call(this, nextProps);
        if (AppConfig_1.default.isDevelopmentMode()) {
            if (this.props.restrictFocusWithin !== nextProps.restrictFocusWithin) {
                console.error('View: restrictFocusWithin is readonly and changing it during the component life cycle has no effect');
            }
            if (this.props.limitFocusWithin !== nextProps.limitFocusWithin) {
                console.error('View: limitFocusWithin is readonly and changing it during the component life cycle has no effect');
            }
        }
        if (('arbitrateFocus' in nextProps) && (this.props.arbitrateFocus !== nextProps.arbitrateFocus)) {
            this._updateFocusArbitratorProvider(nextProps);
        }
    };
    View.prototype.enableFocusManager = function () {
        if (this._focusManager) {
            if (this.props.restrictFocusWithin && this._isFocusRestricted !== false) {
                this._focusManager.restrictFocusWithin(FocusManager_1.RestrictFocusType.RestrictedFocusFirst);
            }
            if (this._limitFocusWithin && this._isFocusLimited) {
                this._focusManager.limitFocusWithin(this.props.limitFocusWithin);
            }
        }
    };
    View.prototype.disableFocusManager = function () {
        if (this._focusManager) {
            this._focusManager.release();
        }
    };
    View.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        if (this.props.autoFocus) {
            this.requestFocus();
        }
        // If we are mounted as visible, do our initialization now. If we are hidden, it will
        // be done later when the popup is shown.
        if (!this._isHidden()) {
            this.enableFocusManager();
        }
        if (this._focusManager && this._popupContainer) {
            this._popupToken = this._popupContainer.registerPopupComponent(function () { return _this.enableFocusManager(); }, function () { return _this.disableFocusManager(); });
        }
    };
    View.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.disableFocusManager();
        if (this._popupToken) {
            this._popupContainer.unregisterPopupComponent(this._popupToken);
        }
    };
    View.prototype.blur = function () {
        var el = this._getContainer();
        if (el) {
            el.blur();
        }
    };
    View.prototype.requestFocus = function () {
        var _this = this;
        AutoFocusHelper_1.FocusArbitratorProvider.requestFocus(this, function () { return _this.focus(); }, function () { return _this._isMounted; });
    };
    View.prototype.focus = function () {
        var el = this._getContainer();
        if (el) {
            el.focus();
        }
    };
    View.contextTypes = {
        isRxParentAText: PropTypes.bool,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        focusArbitrator: PropTypes.object,
    };
    View.childContextTypes = {
        isRxParentAText: PropTypes.bool.isRequired,
        focusManager: PropTypes.object,
        popupContainer: PropTypes.object,
        focusArbitrator: PropTypes.object,
    };
    return View;
}(ViewBase_1.default));
exports.View = View;
(0, FocusManager_2.applyFocusableComponentMixin)(View, function (nextProps) {
    // VoiceOver with the VoiceOver key combinations (Ctrl+Option+Left/Right) focuses
    // <div>s when whatever tabIndex is set (even if tabIndex=-1). So, View is focusable
    // when tabIndex is not undefined.
    var tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined;
});
exports.default = View;
