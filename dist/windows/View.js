"use strict";
/**
 * View.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Windows-specific implementation of View.
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
var RN = require("react-native");
var RNW = require("react-native-windows");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var AppConfig_1 = require("../common/AppConfig");
var assert_1 = require("../common/assert");
var EventHelpers_1 = require("../native-common/utils/EventHelpers");
var FocusManager_1 = require("../native-desktop/utils/FocusManager");
var FocusManager_2 = require("../common/utils/FocusManager");
var Interfaces_1 = require("../common/Interfaces");
var UserInterface_1 = require("../native-common/UserInterface");
var View_1 = require("../native-common/View");
var KEY_CODE_ENTER = 13;
var KEY_CODE_SPACE = 32;
var KEY_CODE_F10 = 121;
var KEY_CODE_APP = 500;
var DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER, KEY_CODE_F10, KEY_CODE_APP];
var UP_KEYCODES = [KEY_CODE_SPACE];
var FocusableView = RNW.createFocusableComponent(RN.View);
var FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._focusableElement = null;
        _this._limitFocusWithin = false;
        _this._isFocusLimited = false;
        _this._onFocusableRef = function (btn) {
            _this._focusableElement = btn;
        };
        _this._onFocusableKeyDown = function (e) {
            var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
            if (_this.props.onKeyPress) {
                _this.props.onKeyPress(keyEvent);
            }
            if (_this.props.onPress) {
                var key = keyEvent.keyCode;
                // ENTER triggers press on key down
                if (key === KEY_CODE_ENTER) {
                    _this.props.onPress(keyEvent);
                }
            }
            if (_this.props.onContextMenu) {
                var key = keyEvent.keyCode;
                if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent.shiftKey)) {
                    _this._showContextMenu(keyEvent);
                }
            }
        };
        _this._onFocusableKeyUp = function (e) {
            var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
            if (keyEvent.keyCode === KEY_CODE_SPACE) {
                if (_this.props.onPress) {
                    _this.props.onPress(keyEvent);
                }
            }
        };
        _this._onFocus = function (e) {
            if (e.currentTarget === e.target) {
                _this.onFocus();
            }
            if (_this.props.onFocus) {
                _this.props.onFocus(EventHelpers_1.default.toFocusEvent(e));
            }
        };
        _this._onBlur = function (e) {
            if (_this.props.onBlur) {
                _this.props.onBlur(EventHelpers_1.default.toFocusEvent(e));
            }
        };
        _this._limitFocusWithin =
            (props.limitFocusWithin === Interfaces_1.Types.LimitFocusType.Limited) ||
                (props.limitFocusWithin === Interfaces_1.Types.LimitFocusType.Accessible);
        if (_this.props.restrictFocusWithin || _this._limitFocusWithin) {
            _this._focusManager = new FocusManager_1.FocusManager(context && context.focusManager);
            if (_this._limitFocusWithin) {
                _this.setFocusLimited(true);
            }
        }
        _this._popupContainer = context && context.popupContainer;
        return _this;
    }
    // Offset to show context menu using keyboard.
    View.prototype._getContextMenuOffset = function () {
        return { x: 0, y: 0 };
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
    };
    View.prototype.enableFocusManager = function () {
        if (this._focusManager) {
            if (this.props.restrictFocusWithin && this._isFocusRestricted !== false) {
                this._focusManager.restrictFocusWithin(FocusManager_2.RestrictFocusType.RestrictedFocusFirst);
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
        if (this._focusManager) {
            this._focusManager.setRestrictionStateCallback(this._focusRestrictionCallback.bind(this));
        }
        // If we are mounted as visible, do our initialization now. If we are hidden, it will
        // be done later when the popup is shown.
        if (!this._isHidden()) {
            this.enableFocusManager();
        }
        if (this._focusManager && this._popupContainer) {
            this._popupToken = this._popupContainer.registerPopupComponent(function () { return _this.enableFocusManager(); }, function () { _this.disableFocusManager(); });
        }
    };
    View.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.disableFocusManager();
        if (this._focusManager) {
            this._focusManager.setRestrictionStateCallback(undefined);
        }
        if (this._popupToken) {
            this._popupContainer.unregisterPopupComponent(this._popupToken);
        }
    };
    View.prototype._hasTrait = function (trait, traits) {
        return traits === trait || (Array.isArray(traits) && traits.indexOf(trait) !== -1);
    };
    View.prototype._showContextMenu = function (keyEvent) {
        var _this = this;
        if (this._isMounted) {
            UserInterface_1.default.measureLayoutRelativeToWindow(this).then(function (layoutInfo) {
                // need to simulate the mouse event so that we
                // can show the context menu in the right position
                if (_this._isMounted) {
                    var mouseEvent = EventHelpers_1.default.keyboardToMouseEvent(keyEvent, layoutInfo, _this._getContextMenuOffset());
                    if (_this.props.onContextMenu) {
                        _this.props.onContextMenu(mouseEvent);
                    }
                }
            }).catch(function (e) {
                console.warn('View measureKayoutRelativeToWindow exception: ' + JSON.stringify(e));
            });
        }
    };
    View.prototype._buildInternalProps = function (props) {
        var _this = this;
        // Base class does the bulk of _internalprops creation
        _super.prototype._buildInternalProps.call(this, props);
        // On Windows a view with importantForAccessibility='Yes' or
        // non-empty accessibilityLabel and importantForAccessibility='Auto' (or unspecified) will hide its children.
        // However, a view that is also a group or a dialog should keep children visible to UI Automation.
        // The following condition checks and sets RN importantForAccessibility property
        // to 'yes-dont-hide-descendants' to keep view children visible.
        var hasGroup = this._hasTrait(Interfaces_1.Types.AccessibilityTrait.Group, props.accessibilityTraits);
        var hasDialog = this._hasTrait(Interfaces_1.Types.AccessibilityTrait.Dialog, props.accessibilityTraits);
        var i4aYes = props.importantForAccessibility === Interfaces_1.Types.ImportantForAccessibility.Yes;
        var i4aAuto = (props.importantForAccessibility === Interfaces_1.Types.ImportantForAccessibility.Auto
            || props.importantForAccessibility === undefined);
        var hasLabel = props.accessibilityLabel && props.accessibilityLabel.length > 0;
        if ((hasGroup || hasDialog) && (i4aYes || (i4aAuto && hasLabel))) {
            this._internalProps.importantForAccessibility = 'yes-dont-hide-descendants';
        }
        if (props.onKeyPress) {
            // Define the handler for "onKeyDown" on first use, it's the safest way when functions
            // called from super constructors are involved. Ensuring nothing happens here if a
            // tabIndex is specified else KeyDown is handled twice, in _onFocusableKeyDown as well.
            if (this.props.tabIndex === undefined) {
                if (!this._onKeyDown) {
                    this._onKeyDown = function (e) {
                        var keyEvent = EventHelpers_1.default.toKeyboardEvent(e);
                        if (_this.props.onKeyPress) {
                            // A conversion to a KeyboardEvent looking event is needed
                            _this.props.onKeyPress(keyEvent);
                        }
                        // This needs to be handled when there is no
                        // tabIndex so we do not lose the bubbled events
                        if (_this.props.onContextMenu) {
                            var key = keyEvent.keyCode;
                            if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent.shiftKey)) {
                                _this._showContextMenu(keyEvent);
                            }
                        }
                    };
                }
                // "onKeyDown" is fired by native buttons and bubbles up to views
                this._internalProps.onKeyDown = this._onKeyDown;
            }
        }
        var _loop_1 = function (name_1) {
            var handler = this_1._internalProps[name_1];
            if (handler) {
                this_1._internalProps.allowDrop = true;
                this_1._internalProps[name_1] = function (e) {
                    handler({
                        dataTransfer: e.nativeEvent.dataTransfer,
                        stopPropagation: function () {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },
                        preventDefault: function () {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        },
                    });
                };
            }
        };
        var this_1 = this;
        // Drag and drop related properties
        for (var _i = 0, _a = ['onDragEnter', 'onDragOver', 'onDrop', 'onDragLeave']; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            _loop_1(name_1);
        }
        var _loop_2 = function (name_2) {
            var handler = this_2._internalProps[name_2];
            if (handler) {
                if (name_2 === 'onDragStart') {
                    this_2._internalProps.allowDrag = true;
                }
                this_2._internalProps[name_2] = function (e) {
                    handler({
                        dataTransfer: e.nativeEvent.dataTransfer,
                        stopPropagation: function () {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                        },
                        preventDefault: function () {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        },
                    });
                };
            }
        };
        var this_2 = this;
        // Drag and drop related properties
        for (var _b = 0, _c = ['onDragStart', 'onDrag', 'onDragEnd']; _b < _c.length; _b++) {
            var name_2 = _c[_b];
            _loop_2(name_2);
        }
        // Mouse events (using same lazy initialization as for onKeyDown)
        if (props.onMouseEnter) {
            if (!this._onMouseEnter) {
                this._onMouseEnter = function (e) {
                    if (_this.props.onMouseEnter) {
                        _this.props.onMouseEnter(EventHelpers_1.default.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseEnter = this._onMouseEnter;
        }
        if (props.onMouseLeave) {
            if (!this._onMouseLeave) {
                this._onMouseLeave = function (e) {
                    if (_this.props.onMouseLeave) {
                        _this.props.onMouseLeave(EventHelpers_1.default.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseLeave = this._onMouseLeave;
        }
        if (props.onMouseOver) {
            if (!this._onMouseOver) {
                this._onMouseOver = function (e) {
                    if (_this.props.onMouseOver) {
                        _this.props.onMouseOver(EventHelpers_1.default.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseOver = this._onMouseOver;
        }
        if (props.onMouseMove) {
            if (!this._onMouseMove) {
                this._onMouseMove = function (e) {
                    if (_this.props.onMouseMove) {
                        _this.props.onMouseMove(EventHelpers_1.default.toMouseEvent(e));
                    }
                };
            }
            this._internalProps.onMouseMove = this._onMouseMove;
        }
    };
    View.prototype.render = function () {
        if (this.props.tabIndex !== undefined) {
            var tabIndex = this.getTabIndex() || 0;
            var windowsTabFocusable = tabIndex >= 0;
            var importantForAccessibility = this.getImportantForAccessibility();
            // We don't use 'string' ref type inside ReactXP
            var originalRef = this._internalProps.ref;
            (0, assert_1.default)(!(typeof originalRef === 'string'), 'View: ReactXP must not use string refs internally');
            var componentRef = originalRef;
            var focusableViewProps = __assign(__assign({}, this._internalProps), { ref: this._onFocusableRef, componentRef: componentRef, isTabStop: windowsTabFocusable, tabIndex: tabIndex, importantForAccessibility: importantForAccessibility, disableSystemFocusVisuals: false, handledKeyDownKeys: DOWN_KEYCODES, handledKeyUpKeys: UP_KEYCODES, onKeyDown: this._onFocusableKeyDown, onKeyUp: this._onFocusableKeyUp, onFocus: this._onFocus, onBlur: this._onBlur, onAccessibilityTap: this._internalProps.onPress, testID: this.props.testId });
            var PotentiallyAnimatedFocusableView = this._isButton(this.props) ? FocusableAnimatedView : FocusableView;
            return (React.createElement(PotentiallyAnimatedFocusableView, __assign({}, focusableViewProps)));
        }
        else {
            return _super.prototype.render.call(this);
        }
    };
    View.prototype.requestFocus = function () {
        if (!this._focusableElement) {
            // Views with no tabIndex (even if -1) can't receive focus
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('View: requestFocus called on a non focusable element');
            }
            return;
        }
        _super.prototype.requestFocus.call(this);
    };
    View.prototype.focus = function () {
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.focus();
        }
        else {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('View: focus called on a non focusable element');
            }
        }
    };
    View.prototype.blur = function () {
        // Only forward to Button.
        // The other cases are RN.View based elements with no meaningful focus support
        if (this._focusableElement) {
            this._focusableElement.blur();
        }
    };
    View.prototype.getChildContext = function () {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        var childContext = _super.prototype.getChildContext.call(this);
        childContext.isRxParentAText = false;
        // Provide the descendants with the focus manager (if any).
        if (this._focusManager) {
            childContext.focusManager = this._focusManager;
            // This FocusManager instance can restrict/limit the controls it tracks.
            // The count of keyboard focusable controls is relatively low, yet the "accessible focusable" (by screen reader) one can
            // trigger performance issues.
            // One way to narrow down to a manageable set is to ignore "accessible focusable" controls that are children of
            // focusable controls, as long as they are tracked by same FocusManager .
            childContext.isRxParentAFocusableInSameFocusManager = false;
        }
        if (this._popupContainer) {
            childContext.popupContainer = this._popupContainer;
        }
        // We use a context field to signal any component in the subtree to disable any system provided context menus.
        // This is not a bulletproof mechanism, context changes not being guaranteed to be detected by children, depending on factors
        // like shouldComponentUpdate methods on intermediate nodes, etc.
        // Fortunately press handlers are pretty stable.
        if (this._isButton(this.props)) {
            // This instance can be a responder. It may or may not have to invoke an onContextMenu handler, but
            // it will consume all corresponding touch events, so overwriting any parent-set value is the correct thing to do.
            childContext.isRxParentAContextMenuResponder = !!this.props.onContextMenu;
        }
        if (this.props.tabIndex !== undefined) {
            // This button will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
            childContext.isRxParentAFocusableInSameFocusManager = true;
        }
        return childContext;
    };
    View.prototype._isHidden = function () {
        return !!this._popupContainer && this._popupContainer.isHidden();
    };
    View.prototype.setFocusRestricted = function (restricted) {
        if (!this._focusManager || !this.props.restrictFocusWithin) {
            console.error('View: setFocusRestricted method requires restrictFocusWithin property to be set');
            return;
        }
        if (!this._isHidden()) {
            if (restricted) {
                this._focusManager.restrictFocusWithin(FocusManager_2.RestrictFocusType.RestrictedFocusFirst);
            }
            else {
                this._focusManager.removeFocusRestriction();
            }
        }
        this._isFocusRestricted = restricted;
    };
    View.prototype.setFocusLimited = function (limited) {
        if (!this._focusManager || !this._limitFocusWithin) {
            console.error('View: setFocusLimited method requires limitFocusWithin property to be set');
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
    View.prototype._focusRestrictionCallback = function (restricted) {
        // Complementary mechanism to ensure focus cannot get out (through tabbing) of this view
        // when restriction is enabled.
        // This covers cases where outside the view focusable controls are not controlled and/or not controllable
        // by FocusManager
        var viewProps = {
            tabNavigation: restricted !== FocusManager_2.RestrictFocusType.Unrestricted ? 'cycle' : 'local',
        };
        this.setNativeProps(viewProps);
    };
    View.prototype.setNativeProps = function (nativeProps) {
        // Redirect to focusable component if present.
        if (this._focusableElement) {
            this._focusableElement.setNativeProps(nativeProps);
        }
        else {
            _super.prototype.setNativeProps.call(this, nativeProps);
        }
    };
    View.prototype._isButton = function (viewProps) {
        return _super.prototype._isButton.call(this, viewProps) || !!viewProps.onContextMenu;
    };
    // From FocusManagerFocusableComponent interface
    //
    View.prototype.onFocus = function () {
        // Focus Manager hook
    };
    View.prototype.getTabIndex = function () {
        // Focus Manager may override this
        return this.props.tabIndex;
    };
    View.prototype.getImportantForAccessibility = function () {
        // Focus Manager may override this
        // Use a default of Auto if the computed value is undefined
        return this._internalProps.importantForAccessibility ||
            AccessibilityUtil_1.default.importantForAccessibilityToString(Interfaces_1.Types.ImportantForAccessibility.Auto);
    };
    View.prototype.updateNativeAccessibilityProps = function () {
        if (this._focusableElement) {
            var tabIndex = this.getTabIndex() || 0;
            var windowsTabFocusable = tabIndex >= 0;
            var importantForAccessibility = this.getImportantForAccessibility();
            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable,
                importantForAccessibility: importantForAccessibility,
            });
        }
    };
    View.contextTypes = __assign({ isRxParentAText: PropTypes.bool, focusManager: PropTypes.object, popupContainer: PropTypes.object }, View_1.View.contextTypes);
    View.childContextTypes = __assign({ isRxParentAText: PropTypes.bool.isRequired, focusManager: PropTypes.object, popupContainer: PropTypes.object, isRxParentAContextMenuResponder: PropTypes.bool, isRxParentAFocusableInSameFocusManager: PropTypes.bool }, View_1.View.childContextTypes);
    return View;
}(View_1.View));
exports.View = View;
// A value for tabIndex marks a View as being potentially keyboard/screen reader focusable
(0, FocusManager_1.applyFocusableComponentMixin)(View, function (nextProps) {
    var tabIndex = nextProps && ('tabIndex' in nextProps) ? nextProps.tabIndex : this.props.tabIndex;
    return tabIndex !== undefined;
});
exports.default = View;
