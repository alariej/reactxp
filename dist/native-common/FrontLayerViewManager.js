"use strict";
/**
 * FrontLayerViewManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages stackable modals and popup views that are posted and dismissed
 * by the Types showModal/dismissModal/showPopup/dismissPopup methods.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontLayerViewManager = void 0;
var React = require("react");
var RN = require("react-native");
var subscribableevent_1 = require("subscribableevent");
var ModalContainer_1 = require("../native-common/ModalContainer");
var Timers_1 = require("../common/utils/Timers");
var _ = require("./utils/lodashMini");
var PopupContainerView_1 = require("./PopupContainerView");
var ModalStackContext = /** @class */ (function () {
    function ModalStackContext(modalId, modal, modalOptions) {
        this.modalId = modalId;
        this.modal = modal;
        this.modalOptions = modalOptions;
    }
    return ModalStackContext;
}());
var PopupStackContext = /** @class */ (function () {
    function PopupStackContext(popupId, popupOptions, anchorHandle) {
        this.popupId = popupId;
        this.popupOptions = popupOptions;
        this.anchorHandle = anchorHandle;
    }
    return PopupStackContext;
}());
var _styles = {
    fullScreenView: {
        flex: 1,
        alignSelf: 'stretch',
        overflow: 'visible',
        backgroundColor: 'transparent', // otherwise in UWP it will be removed from the tree and won't receive mouse events
    },
};
var MAX_CACHED_POPUPS = 4;
var FrontLayerViewManager = /** @class */ (function () {
    function FrontLayerViewManager() {
        var _this = this;
        this._overlayStack = [];
        this._cachedPopups = [];
        this.event_changed = new subscribableevent_1.default();
        this._onBackgroundPressed = function (e) {
            e.persist();
            var activePopupContext = _this._getActiveOverlay();
            if (!(activePopupContext instanceof PopupStackContext)) {
                return;
            }
            if (activePopupContext.popupOptions) {
                if (activePopupContext.popupOptions.onAnchorPressed) {
                    RN.NativeModules.UIManager.measureInWindow(activePopupContext.anchorHandle, function (x, y, width, height) {
                        var touchEvent = e.nativeEvent;
                        var anchorRect = { left: x, top: y, right: x + width,
                            bottom: y + height, width: width, height: height };
                        // Find out if the press event was on the anchor so we can notify the caller about it.
                        if (!_.isUndefined(touchEvent.pageX) && !_.isUndefined(touchEvent.pageY) &&
                            touchEvent.pageX >= anchorRect.left && touchEvent.pageX < anchorRect.right
                            && touchEvent.pageY >= anchorRect.top && touchEvent.pageY < anchorRect.bottom) {
                            // Showing another animation while dimissing the popup creates a conflict in the
                            // UI making it not doing one of the two animations (i.e.: Opening an actionsheet
                            // while dismissing a popup). We introduce this delay to make sure the popup
                            // dimissing animation has finished before we call the event handler.
                            Timers_1.default.setTimeout(function () { activePopupContext.popupOptions.onAnchorPressed(e); }, 500);
                        }
                    });
                }
                // Avoid dismissing if the caller has explicitly asked to prevent
                // dismissal on clicks.
                if (activePopupContext.popupOptions.preventDismissOnPress) {
                    return;
                }
            }
            _this._dismissActivePopup();
        };
    }
    FrontLayerViewManager.prototype.showModal = function (modal, modalId, options) {
        var index = this._findIndexOfModal(modalId);
        if (index === -1) {
            this._overlayStack.push(new ModalStackContext(modalId, modal, options));
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.isModalDisplayed = function (modalId) {
        if (modalId) {
            return this._findIndexOfModal(modalId) !== -1;
        }
        return this._overlayStack.some(function (iter) { return iter instanceof ModalStackContext; });
    };
    FrontLayerViewManager.prototype.dismissModal = function (modalId) {
        var index = this._findIndexOfModal(modalId);
        if (index >= 0) {
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.dismissAllmodals = function () {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, function (iter) { return !(iter instanceof ModalStackContext); });
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.showPopup = function (popupOptions, popupId, delay) {
        var index = this._findIndexOfPopup(popupId);
        if (index === -1) {
            var nodeHandle = RN.findNodeHandle(popupOptions.getAnchor());
            if (nodeHandle) {
                if (popupOptions.cacheable) {
                    // The popup is transitioning from cached to active.
                    this._cachedPopups = this._cachedPopups.filter(function (popup) { return popup.popupId !== popupId; });
                }
                this._overlayStack.push(new PopupStackContext(popupId, popupOptions, nodeHandle));
                this.event_changed.fire();
                return true;
            }
        }
        return false;
    };
    FrontLayerViewManager.prototype.dismissPopup = function (popupId) {
        var index = this._findIndexOfPopup(popupId);
        if (index >= 0) {
            var popupContext = this._overlayStack[index];
            if (popupContext.popupOptions.cacheable) {
                // The popup is transitioning from active to cached.
                this._cachedPopups.push(popupContext);
                this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
            }
            this._overlayStack.splice(index, 1);
            if (popupContext.popupOptions.onDismiss) {
                popupContext.popupOptions.onDismiss();
            }
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.dismissAllPopups = function () {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, function (iter) { return !(iter instanceof PopupStackContext); });
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.getModalLayerView = function (rootViewId) {
        var _this = this;
        if (rootViewId === null) {
            // The Modal layer is only supported on root views that have set an id, or
            // the default root view (which has an undefined id)
            return null;
        }
        var overlayContext = _.findLast(this._overlayStack, function (context) { return context instanceof ModalStackContext && _this._modalOptionsMatchesRootViewId(context.modalOptions, rootViewId); });
        if (overlayContext) {
            return (React.createElement(ModalContainer_1.ModalContainer, null, overlayContext.modal));
        }
        return null;
    };
    FrontLayerViewManager.prototype.getActivePopupId = function () {
        var activeOverlay = this._getActiveOverlay();
        if (activeOverlay && (activeOverlay instanceof PopupStackContext)) {
            return activeOverlay.popupId;
        }
        return null;
    };
    FrontLayerViewManager.prototype.releaseCachedPopups = function () {
        this._cachedPopups = [];
    };
    // Returns true if both are undefined, or if there are options and the rootViewIds are equal.
    FrontLayerViewManager.prototype._modalOptionsMatchesRootViewId = function (options, rootViewId) {
        return !!(options === rootViewId || options && options.rootViewId === rootViewId);
    };
    FrontLayerViewManager.prototype._renderPopup = function (context, hidden) {
        var _this = this;
        var key = (context.popupOptions.cacheable ? 'CP:' : 'P:') + context.popupId;
        return (React.createElement(PopupContainerView_1.default, { key: key, popupOptions: context.popupOptions, anchorHandle: hidden ? undefined : context.anchorHandle, onDismissPopup: hidden ? undefined : function () { return _this.dismissPopup(context.popupId); }, hidden: hidden }));
    };
    FrontLayerViewManager.prototype._getOverlayContext = function (rootViewId) {
        return _.findLast(this._overlayStack, function (context) { return context instanceof PopupStackContext && context.popupOptions.rootViewId === rootViewId; });
    };
    FrontLayerViewManager.prototype.isPopupActiveFor = function (rootViewId) {
        return this._getOverlayContext(rootViewId) !== undefined;
    };
    FrontLayerViewManager.prototype.getPopupLayerView = function (rootViewId) {
        var _this = this;
        if (rootViewId === null) {
            // The Popup layer is supported only on root views that have set an id and
            // the default root view (which has an undefined id).
            return null;
        }
        var popupContainerViews = [];
        var overlayContext = this._getOverlayContext(rootViewId);
        if (overlayContext) {
            popupContainerViews.push(this._renderPopup(overlayContext, false));
        }
        this._cachedPopups.forEach(function (context) { return popupContainerViews.push(_this._renderPopup(context, true)); });
        if (popupContainerViews.length > 0) {
            return (React.createElement(ModalContainer_1.ModalContainer, { hidden: !overlayContext },
                React.createElement(RN.TouchableWithoutFeedback, { onPressOut: this._onBackgroundPressed, importantForAccessibility: 'no' },
                    React.createElement(RN.View, { style: _styles.fullScreenView }, popupContainerViews))));
        }
        return null;
    };
    FrontLayerViewManager.prototype._dismissActivePopup = function () {
        // Dismiss any currently visible popup:
        var activePopupContext = this._getActiveOverlay();
        if (activePopupContext instanceof PopupStackContext) {
            this.dismissPopup(activePopupContext.popupId);
        }
    };
    FrontLayerViewManager.prototype._findIndexOfModal = function (modalId) {
        return _.findIndex(this._overlayStack, function (iter) { return iter instanceof ModalStackContext && iter.modalId === modalId; });
    };
    FrontLayerViewManager.prototype._findIndexOfPopup = function (popupId) {
        return _.findIndex(this._overlayStack, function (iter) { return iter instanceof PopupStackContext && iter.popupId === popupId; });
    };
    FrontLayerViewManager.prototype._getActiveOverlay = function () {
        // Check for any Popup in queue
        return this._overlayStack.length === 0 ? null : _.last(this._overlayStack);
    };
    FrontLayerViewManager.prototype.isPopupDisplayed = function (popupId) {
        if (popupId) {
            return this._findIndexOfPopup(popupId) !== -1;
        }
        return this._overlayStack.some(function (iter) { return iter instanceof PopupStackContext; });
    };
    return FrontLayerViewManager;
}());
exports.FrontLayerViewManager = FrontLayerViewManager;
exports.default = new FrontLayerViewManager();
