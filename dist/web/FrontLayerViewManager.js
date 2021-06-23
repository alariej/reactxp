"use strict";
/**
 * FrontLayerViewManager.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages the layering of the main view, modals and popups.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontLayerViewManager = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var Timers_1 = require("../common/utils/Timers");
var MouseResponder_1 = require("./utils/MouseResponder");
var RootView_1 = require("./RootView");
var MAX_CACHED_POPUPS = 4;
var FrontLayerViewManager = /** @class */ (function () {
    function FrontLayerViewManager() {
        var _this = this;
        this._modalStack = [];
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = 0;
        this._cachedPopups = [];
        // We need to be careful accessing document because it may not be defined
        // in some environments like Electron.
        this._isRtlDefault = typeof document !== 'undefined' &&
            typeof document.documentElement !== 'undefined' && document.documentElement.dir === 'rtl';
        this._isRtlAllowed = true;
        this._isRtlForced = false;
        this._shouldPopupBeDismissed = function (options) { return (!!_this._activePopupOptions &&
            _this._activePopupOptions.getAnchor() === options.getAnchor()); };
    }
    FrontLayerViewManager.prototype.setMainView = function (element) {
        this._mainView = element;
        this._renderRootView();
    };
    FrontLayerViewManager.prototype.isModalDisplayed = function (modalId) {
        if (modalId) {
            return this._modalStack.some(function (d) { return d.id === modalId; });
        }
        else {
            return this._modalStack.length > 0;
        }
    };
    FrontLayerViewManager.prototype.showModal = function (modal, modalId, options) {
        // Dismiss any active popups.
        if (this._activePopupOptions) {
            this.dismissPopup(this._activePopupId);
        }
        this._modalStack.push({ modal: modal, id: modalId });
        this._renderRootView();
    };
    FrontLayerViewManager.prototype.dismissModal = function (modalId) {
        this._modalStack = this._modalStack.filter(function (d) { return d.id !== modalId; });
        this._renderRootView();
    };
    FrontLayerViewManager.prototype.dismissAllModals = function () {
        if (this._modalStack.length > 0) {
            this._modalStack = [];
            this._renderRootView();
        }
    };
    FrontLayerViewManager.prototype._updateModalDisplayedState = function () {
        MouseResponder_1.default.setModalIsDisplayed(this.isModalDisplayed());
    };
    FrontLayerViewManager.prototype.showPopup = function (options, popupId, showDelay) {
        // If options.dismissIfShown is true, calling this method will behave like a toggle.
        // On one call, it will open the popup. If it is called when pop up is seen, it will
        // dismiss the popup. If options.dismissIfShown is false, we will simply show the
        // popup always.
        if (options.dismissIfShown) {
            if (this._shouldPopupBeDismissed(options)) {
                this.dismissPopup(popupId);
                return false;
            }
        }
        this._showPopup(options, popupId, showDelay);
        return true;
    };
    FrontLayerViewManager.prototype._showPopup = function (options, popupId, showDelay) {
        var _this = this;
        // New popup is transitioning from maybe cached to active.
        this._cachedPopups = this._cachedPopups.filter(function (popup) { return popup.popupId !== popupId; });
        if (this._activePopupOptions && this._activePopupOptions.cacheable && this._activePopupId !== popupId) {
            // Old popup is transitioning from active to cached.
            this._cachedPopups.push({ popupOptions: this._activePopupOptions, popupId: this._activePopupId });
            this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
        }
        // Update fields before calling onDismiss to guard against reentry.
        var oldPopupOptions = this._activePopupOptions;
        this._activePopupOptions = options;
        this._activePopupId = popupId;
        this._activePopupAutoDismiss = false;
        this._activePopupAutoDismissDelay = 0;
        this._activePopupShowDelay = showDelay || 0;
        if (this._popupShowDelayTimer) {
            Timers_1.default.clearTimeout(this._popupShowDelayTimer);
            this._popupShowDelayTimer = undefined;
        }
        if (this._activePopupShowDelay > 0) {
            this._popupShowDelayTimer = Timers_1.default.setTimeout(function () {
                _this._activePopupShowDelay = 0;
                _this._popupShowDelayTimer = undefined;
                _this._renderRootView();
            }, this._activePopupShowDelay);
        }
        if (oldPopupOptions) {
            if (oldPopupOptions.onDismiss) {
                oldPopupOptions.onDismiss();
            }
        }
        this._renderRootView();
    };
    FrontLayerViewManager.prototype.autoDismissPopup = function (popupId, dismissDelay) {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                Timers_1.default.clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = undefined;
            }
            this._activePopupAutoDismiss = true;
            this._activePopupAutoDismissDelay = dismissDelay || 0;
            this._renderRootView();
        }
    };
    FrontLayerViewManager.prototype.dismissPopup = function (popupId) {
        if (popupId === this._activePopupId && this._activePopupOptions) {
            if (this._popupShowDelayTimer) {
                Timers_1.default.clearTimeout(this._popupShowDelayTimer);
                this._popupShowDelayTimer = undefined;
            }
            if (this._activePopupOptions.cacheable) {
                // The popup is transitioning from active to cached.
                this._cachedPopups.push({ popupOptions: this._activePopupOptions, popupId: this._activePopupId });
                this._cachedPopups = this._cachedPopups.slice(-MAX_CACHED_POPUPS);
            }
            // Reset fields before calling onDismiss to guard against reentry.
            var activePopupOptions = this._activePopupOptions;
            this._activePopupOptions = undefined;
            this._activePopupId = undefined;
            if (activePopupOptions.onDismiss) {
                activePopupOptions.onDismiss();
            }
            this._renderRootView();
        }
    };
    FrontLayerViewManager.prototype.dismissAllPopups = function () {
        if (this._activePopupId) {
            this.dismissPopup(this._activePopupId);
        }
    };
    FrontLayerViewManager.prototype._renderRootView = function () {
        var _this = this;
        var topModal = this._modalStack.length > 0 ?
            this._modalStack[this._modalStack.length - 1].modal : undefined;
        var activePopup = (!this._activePopupOptions || this._activePopupShowDelay > 0) ? undefined :
            { popupOptions: this._activePopupOptions, popupId: this._activePopupId };
        this._updateModalDisplayedState();
        var rootView = (React.createElement(RootView_1.RootView, { mainView: this._mainView, keyBoardFocusOutline: this._mainView.props.keyBoardFocusOutline, mouseFocusOutline: this._mainView.props.mouseFocusOutline, modal: topModal, activePopup: activePopup, cachedPopup: this._cachedPopups, autoDismiss: this._activePopupAutoDismiss, autoDismissDelay: this._activePopupAutoDismissDelay, onDismissPopup: function () { return _this.dismissPopup(_this._activePopupId); }, writingDirection: this._isRtlForced ? 'rtl' : (this._isRtlAllowed ? 'auto' : 'ltr') }));
        var container = document.getElementsByClassName('app-container')[0];
        ReactDOM.render(rootView, container);
    };
    FrontLayerViewManager.prototype.isPopupDisplayed = function (popupId) {
        if (popupId) {
            return popupId === this._activePopupId;
        }
        else {
            return !!this._activePopupId;
        }
    };
    FrontLayerViewManager.prototype.allowRTL = function (allow) {
        if (this._isRtlAllowed !== allow) {
            this._isRtlAllowed = allow;
            this._renderRootView();
        }
    };
    FrontLayerViewManager.prototype.forceRTL = function (force) {
        if (this._isRtlForced !== force) {
            this._isRtlForced = force;
            this._renderRootView();
        }
    };
    FrontLayerViewManager.prototype.isRTL = function () {
        return this._isRtlForced || (this._isRtlDefault && this._isRtlAllowed);
    };
    return FrontLayerViewManager;
}());
exports.FrontLayerViewManager = FrontLayerViewManager;
exports.default = new FrontLayerViewManager();
